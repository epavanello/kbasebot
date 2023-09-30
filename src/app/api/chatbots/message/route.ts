import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { ConversationLog } from "@/modules/chatbots/conversation-log";
import { getContext } from "@/modules/chatbots/context";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { templates } from "@/modules/chatbots/templates";
import { HELICONE_API_KEY, OPENAI_API_KEY } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClientAdmin } from "@/lib/supabase.server";
import { getErrorMessage } from "@/lib/utils";
import { countMonthlyConversationUsage, getSubscription } from "@/lib/supabase";
import { getPermissions } from "@/lib/permissions/plans";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId, chatbotId } = await req.json();

    if (!conversationId) {
      throw new Error("conversationId is required");
    }

    const supabaseAdminClient = getSupabaseClientAdmin();

    const userPrompt = messages?.length ? messages[messages.length - 1] : [];

    if (!userPrompt?.content?.length)
      throw new Error("Please write a question");

    let {
      user_id: ownerId,
      model,
      custom_context,
    } = (
      await supabaseAdminClient
        .from("chatbots")
        .select("user_id, model, custom_context")
        .eq("id", chatbotId)
        .single()
        .throwOnError()
    ).data!;

    const ownerSubscription = await getSubscription(
      supabaseAdminClient,
      ownerId,
    );

    const permission = getPermissions(ownerSubscription);

    if (
      !["gpt-3.5-turbo", "gpt-4"].includes(model) ||
      permission.plan === "free"
    ) {
      model = "gpt-3.5-turbo";
    }

    if (
      (await countMonthlyConversationUsage(supabaseAdminClient, ownerId)) >
      permission.permission.maxMessages
    ) {
      throw new Error("The chatbot has reached the monthly limit");
    }

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(
      conversationId,
      chatbotId,
      ownerId,
      supabaseAdminClient,
    );

    await conversationLog.addEntry({
      entry: userPrompt.content as string,
      speaker: IConversationSpeaker.User,
    });

    const conversationHistory: ChatCompletionRequestMessage[] =
      await conversationLog.getConversation({
        limit: 10,
      });

    // Get the context from the last message
    const context = await getContext(
      userPrompt.content,
      chatbotId,
      supabaseAdminClient,
    );

    const prompt: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: custom_context || templates.basic({ context, model }),
      },
    ];

    const config = new Configuration({
      apiKey: OPENAI_API_KEY,
      /*basePath: "https://oai.hconeai.com/v1",
      baseOptions: {
        headers: {
          "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`,
          "Helicone-RateLimit-Policy": "1000;w=3600",
          "Helicone-User-Id": chatbotId,
          "Helicone-Property-Conversation-Id": conversationId,
        },
      },*/
    });

    const openai = new OpenAIApi(config);

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model,
      stream: true,
      messages: [
        ...prompt,
        ...conversationHistory.filter(
          (message: ChatCompletionRequestMessage) =>
            message.content && message.role === "user",
        ),
      ],
      functions: [
        {
          name: "store_lead",
          description: "Call the lead store function whenever a lead is found",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              email: {
                type: "string",
              },
              phone: {
                type: "string",
              },
            },
            required: ["email"],
          },
        },
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      async onCompletion(result) {
        await conversationLog.addEntry({
          entry: result,
          speaker: IConversationSpeaker.Assistant,
        });
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
