import { ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { ConversationLog } from "@/modules/chatbots/conversation-log";
import { TokenCounter, printKnowledgeBaseResponse, searchKnowledgeBase, tokenLimits } from "@/modules/chatbots/context";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { ILeads, templates } from "@/modules/chatbots/templates";
import { HELICONE_API_KEY, OPENAI_API_KEY } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClientAdmin } from "@/lib/supabase.server";
import { getErrorMessage } from "@/lib/utils";
import { Chatbot, countMonthlyConversationUsage, getSubscription } from "@/lib/supabase";
import { getPermissions } from "@/lib/permissions/plans";
import { GPTModel, GPTModels, prettifyGPTModelName } from "@/modules/chatbots/helpers";
import { callStoreLeads, FUNC_STORE_LEAD, storeLeadSchema } from "@/modules/chatbots/function-call/store-leads";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages: clientMessages, conversationId, chatbotId } = await req.json();

    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || req.ip;
    const authTokens = req.headers.get("X-Auth-Token");

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
      0 > 0 ||
      ((ip &&
        (
          await supabaseAdminClient
            .from("leads")
            .select("*", { count: "exact" })
            .eq("ip", ip)
            .maybeSingle()
            .throwOnError()
        )?.count) ||
        0) > 0;

    const ownerSubscription = await getSubscription(supabaseAdminClient, ownerId);

    const { permission, plan } = getPermissions(ownerSubscription);

    if (!GPTModels.includes(model as GPTModel) || plan === "free") {
      model = GPTModel.GPT_3_5_Turbo;
    }

    if ((await countMonthlyConversationUsage(supabaseAdminClient, ownerId)) > permission.maxMessages) {
      throw new Error("The chatbot has reached the monthly limit");
    }

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(conversationId, chatbotId, ownerId, supabaseAdminClient);

    await conversationLog.addEntry({
      entry: userPrompt.content as string,
      speaker: IConversationSpeaker.User,
    });

    let conversationHistory: ChatCompletionRequestMessage[] = await conversationLog.getConversation({
      limit: 10,
    });

    // Count actual tokens to limit the conversation history
    const embeddingCounter = new TokenCounter(1_000);

    // Add here the previous questions to have a better searching context
    // Get the context from the last message
    const knowledgeBase = await searchKnowledgeBase(
      // Get the last 5 user messages from the conversation history
      conversationHistory
        .filter((entry) => entry.role === IConversationSpeaker.User)
        .slice(-5)
        .reverse()
        .filter((entry) => embeddingCounter.canAdd(entry.content || ""))
        .reverse()
        .map((entry) => entry.content)
        .join("\n"),
      chatbotId,
      supabaseAdminClient,
    );

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
      content: templates.searchResults({ results: printKnowledgeBaseResponse(knowledgeBase) }),
    });

    // Count actual tokens to limit the conversation history
    const messagesCounter = new TokenCounter(0);
    messagesCounter.count(messages.reduce((acc, message) => acc + message.content, ""));

    // filter out the most old messages if the conversation history is too long
    const historyCounter = new TokenCounter(tokenLimits.historyAvailable(messagesCounter.countedTokens));

    conversationHistory = conversationHistory
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

    // Load chatbot functions
    const userFunctions = (
      (await supabaseAdminClient.from("chatbot_functions").select("*").eq("chatbot_id", chatbotId).throwOnError())
        .data || []
    ).filter((f) => f.enabled);
    if (userFunctions && permission.canIntegrateWebhooks) {
      userFunctions.forEach((f) => {
        functions.push({
          name: f.name,
          description: f.description,
          parameters: {
            type: "object",
            properties: (f.parameters as { name: string; type: string }[]).reduce(
              (acc, param) => {
                acc[param.name] = { type: param.type };
                return acc;
              },
              {} as Record<string, { type: string }>,
            ),
          },
        });
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
      temperature: 0.1,
      max_tokens: tokenLimits.response,
      ...(functions.length && { functions }),
    });

    if (!response.ok) {
      // check if JSON response is available
      try {
        const json = await response.json();
        throw new Error(json.error.message || response.statusText);
      } catch {
        throw new Error(response.statusText);
      }
    }

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
          sources: knowledgeBase,
        });
      },
      experimental_onFunctionCall: async ({ name, arguments: args }, createFunctionCallMessages) => {
        // if you skip the function call and return nothing, the `function_call`
        // message will be sent to the client for it to handle
        if (name === FUNC_STORE_LEAD) {
          if (("name" in args && args.name) || ("email" in args && args.email) || ("phone" in args && args.phone)) {
            await callStoreLeads(args, conversationId, ownerId, chatbotId, ip, supabaseAdminClient);
          }

          const newMessages = createFunctionCallMessages(args as any);

          return openai.createChatCompletion({
            model,
            stream: true,
            messages: [...messages, ...(newMessages as ChatCompletionRequestMessage[])],
            max_tokens: tokenLimits.response,
          });
        } else {
          const functionCall = userFunctions?.find((f) => f.name === name);
          if (functionCall) {
            try {
              const functionResponse = await fetch(functionCall.webhook, {
                method: "POST",
                body: JSON.stringify(args),
                headers: {
                  "Content-Type": "application/json",
                  ...(authTokens && { Authorization: authTokens }),
                },
              });

              if (!functionResponse.ok) {
                throw new Error(`Function call failed with status ${functionResponse.status}`);
              }

              const response = await functionResponse.json();
              const newMessages = createFunctionCallMessages(response);

              return openai.createChatCompletion({
                model,
                stream: true,
                messages: [...messages, ...(newMessages as ChatCompletionRequestMessage[])],
                max_tokens: tokenLimits.response,
              });
            } catch (e) {
              console.error("Function call failed", e);

              return openai.createChatCompletion({
                model,
                stream: true,
                messages: [
                  ...messages,
                  {
                    role: "system",
                    content: `Function call failed: ${e.message}`,
                  },
                ],
                max_tokens: tokenLimits.response,
              });
            }
          }
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
