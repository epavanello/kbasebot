import { ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { ConversationLog } from "@/modules/chatbots/conversation-log";
import { TokenCounter, searchKnowledgeBase, tokenLimits } from "@/modules/chatbots/context";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { ILeads, templates } from "@/modules/chatbots/templates";
import { HELICONE_API_KEY, OPENAI_API_KEY } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClientAdmin } from "@/lib/supabase.server";
import { getErrorMessage } from "@/lib/utils";
import { Chatbot, Settings, countMonthlyConversationUsage, getSubscription } from "@/lib/supabase";
import { getPermissions } from "@/lib/permissions/plans";
import { GPTModel, GPTModels, prettifyGPTModelName } from "@/modules/chatbots/helpers";
import { callStoreLeads, FUNC_STORE_LEAD, storeLeadSchema } from "@/modules/chatbots/function-call/store-leads";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages: clientMessages, conversationId, chatbotId } = await req.json();

    if (!conversationId) {
      throw new Error("conversationId is required");
    }

    const supabaseAdminClient = getSupabaseClientAdmin();

    const userPrompt = clientMessages?.length ? clientMessages[clientMessages.length - 1] : [];

    if (!userPrompt?.content?.length) throw new Error("Please write a question");

    let {
      user_id: ownerId,
      model,
      custom_context,
      chatbot_settings,
    } = (
      await supabaseAdminClient
        .from("chatbots")
        .select("user_id, model, custom_context, chatbot_settings(leads)")
        .eq("id", chatbotId)
        .single()
        .throwOnError()
    ).data! as any as Pick<Chatbot, "user_id" | "model" | "custom_context"> &
      ({
        chatbot_settings?: {
          leads?: ILeads;
        };
      } | null);

    const isLeadsEnabled =
      chatbot_settings &&
      (chatbot_settings.leads?.name || chatbot_settings.leads?.email || chatbot_settings.leads?.phone);

    const hasLeads =
      (isLeadsEnabled &&
        (
          await supabaseAdminClient
            .from("leads")
            .select("*", { count: "exact" })
            .eq("conversation_id", conversationId)
            .maybeSingle()
            .throwOnError()
        )?.count) ||
      0 > 0;

    const ownerSubscription = await getSubscription(supabaseAdminClient, ownerId);

    const permission = getPermissions(ownerSubscription);

    if (!GPTModels.includes(model as GPTModel) || permission.plan === "free") {
      model = GPTModel.GPT_3_5_Turbo;
    }

    if ((await countMonthlyConversationUsage(supabaseAdminClient, ownerId)) > permission.permission.maxMessages) {
      throw new Error("The chatbot has reached the monthly limit");
    }

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(conversationId, chatbotId, ownerId, supabaseAdminClient);

    await conversationLog.addEntry({
      entry: userPrompt.content as string,
      speaker: IConversationSpeaker.User,
    });

    // Get the context from the last message
    const knowledgeBase = await searchKnowledgeBase(userPrompt.content, chatbotId, supabaseAdminClient);

    const functions: ChatCompletionFunctions[] = [];

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content:
          custom_context ||
          templates.defaultContext({
            model: prettifyGPTModelName(model as GPTModel),
          }),
      },
    ];

    messages.push({
      role: "system",
      content: templates.searchResults({ results: knowledgeBase }),
    });

    // Count actual tokens to limit the conversation history
    const messagesCounter = new TokenCounter(0);
    messagesCounter.count(messages.reduce((acc, message) => acc + message.content, ""));

    // filter out the most old messages if the conversation history is too long
    const historyCounter = new TokenCounter(tokenLimits.historyAvailable(messagesCounter.countedTokens));

    let conversationHistory: ChatCompletionRequestMessage[] = (
      await conversationLog.getConversation({
        limit: 10,
      })
    )
      .reverse()
      .filter((entry) => historyCounter.canAdd(entry.content || ""))
      .reverse();

    messages.push(...conversationHistory);

    // System messages on first position are more likely to be used as context on GPT-3.5 Turbo
    if (isLeadsEnabled && !hasLeads) {
      functions.push(storeLeadSchema(chatbot_settings!.leads));
      messages.push({
        role: "system",
        content: templates.leads(chatbot_settings!.leads),
      });
    }

    const config = new Configuration({
      apiKey: OPENAI_API_KEY,
      basePath: "https://oai.hconeai.com/v1",
      baseOptions: {
        headers: {
          "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`,
          "Helicone-RateLimit-Policy": "1000;w=3600",
          "Helicone-User-Id": chatbotId,
          "Helicone-Property-Conversation-Id": conversationId,
        },
      },
    });

    const openai = new OpenAIApi(config);

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model,
      stream: true,
      messages,
      temperature: 0,
      max_tokens: tokenLimits.response,
      ...(functions.length && { functions }),
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      async onCompletion(result) {
        // check if result is a stringfied JSON, if yes skip the addEntry
        try {
          JSON.parse(result);
          return;
        } catch {}

        await conversationLog.addEntry({
          entry: result,
          speaker: IConversationSpeaker.Assistant,
        });
      },
      experimental_onFunctionCall: async ({ name, arguments: args }, createFunctionCallMessages) => {
        // if you skip the function call and return nothing, the `function_call`
        // message will be sent to the client for it to handle
        if (name === FUNC_STORE_LEAD) {
          await callStoreLeads(args, conversationId, ownerId, chatbotId, supabaseAdminClient);

          // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
          const newMessages = createFunctionCallMessages(args);

          return openai.createChatCompletion({
            model,
            stream: true,
            messages: [...messages, ...(newMessages as ChatCompletionRequestMessage[])],
            max_tokens: tokenLimits.response,
          });
        }
      },
    });
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: getErrorMessage(e, "Something went wrong! please try again"),
      },
      {
        status: 401,
      },
    );
  }
}
