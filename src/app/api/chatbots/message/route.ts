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
import { chatCompletion, standardizeQuery } from "@/modules/chatbots/llm-actions";
import axios from "axios";
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

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
      model = GPTModel.GPT_5_mini;
    }

    if ((await countMonthlyConversationUsage(supabaseAdminClient, ownerId)) > permission.maxMessages) {
      throw new Error("The chatbot has reached the monthly limit, please upgrade to a paid plan");
    }

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(conversationId, chatbotId, ownerId, supabaseAdminClient);

    await conversationLog.addEntry({
      entry: userPrompt.content as string,
      speaker: IConversationSpeaker.User,
    });

    let conversationHistory = await conversationLog.getConversation({
      limit: 10,
      skipFunctions: true,
    });

    // Count actual tokens to limit the conversation history
    const embeddingCounter = new TokenCounter(1_000);

    // Add here the previous questions to have a better searching context
    // Get the context from the last message
    const lastMessages = conversationHistory
      .filter((entry) => entry.role === IConversationSpeaker.User || entry.role === IConversationSpeaker.Assistant)
      .slice(-7)
      .reverse()
      .filter((entry) => embeddingCounter.canAdd((entry.content as string) || ""))
      .reverse();

    const knowledgeBase = await searchKnowledgeBase(
      await standardizeQuery(lastMessages, chatbotId, conversationId),
      chatbotId,
      supabaseAdminClient,
    );

    const functions: ChatCompletionCreateParams.Function[] = [];

    const messages: ChatCompletionMessageParam[] = [
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
      .filter((entry, index) => index === 0 || historyCounter.canAdd((entry.content as string) || ""))
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

    function runCompletion(messagesToSend: ChatCompletionMessageParam[]) {
      return chatCompletion({
        chatbotId,
        conversationId,
        messages: messagesToSend,
        maxTokens: tokenLimits.response > 0 ? tokenLimits.response : undefined,
        model: model as GPTModel,
        ...(functions.length && { functions }),
      });
    }

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await runCompletion(messages);

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      async onCompletion(result) {
        try {
          // Skip json responses
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

          return await runCompletion([...messages, ...(newMessages as ChatCompletionMessageParam[])]);
        } else {
          const functionCall = userFunctions?.find((f) => f.name === name);
          if (functionCall) {
            try {
              const functionResponse = await axios({
                url: functionCall.webhook,
                method: functionCall.request_type || "GET",
                ...(functionCall.request_type === "GET" ? { params: args } : { data: args }),
                headers: {
                  "Content-Type": "application/json",
                  ...(authTokens && { Authorization: authTokens }),
                  ...(functionCall.headers &&
                    (functionCall.headers as { key: string; value: string }[]).reduce(
                      (acc, header) => {
                        acc[header.key] = header.value;
                        return acc;
                      },
                      {} as Record<string, string>,
                    )),
                },
              });

              if (functionResponse.status !== 200) {
                throw new Error(`Function call failed with status ${functionResponse.status}`);
              }

              const response = functionResponse.data;

              await conversationLog.addEntry({
                entry: name,
                speaker: IConversationSpeaker.Function,
                metadata: {
                  arguments: args,
                  response,
                },
              });

              const newMessages = createFunctionCallMessages(response);

              return await runCompletion([...messages, ...(newMessages as ChatCompletionMessageParam[])]);
            } catch (e) {
              console.error("Function call failed", e);

              return await runCompletion([
                ...messages,
                {
                  role: "system",
                  content: `Function call failed: ${getErrorMessage(e)}`,
                },
              ]);
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
