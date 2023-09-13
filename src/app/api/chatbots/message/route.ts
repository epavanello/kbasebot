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
import { NextRequest } from "next/server";
import { getSupabaseClientAdmin } from "@/lib/supabase.server";

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: "https://oai.hconeai.com/v1",
  baseOptions: {
    headers: {
      "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`,
      "Helicone-RateLimit-Policy": "1000;w=3600",
    },
  },
});

const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId, chatbotId } = await req.json();

    if (!conversationId) {
      throw new Error("unauthorized");
    }

    const supabaseAdminClient = getSupabaseClientAdmin();

    const userPrompt = messages?.length ? messages[messages.length - 1] : [];

    if (!userPrompt?.content?.length)
      throw new Error("Please write a question to get answer from ai");

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(
      conversationId,
      chatbotId,
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
        content: templates.basic({ context }),
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        ...prompt,
        ...conversationHistory.filter(
          (message: ChatCompletionRequestMessage) =>
            message.content && message.role === "user",
        ),
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
    return new Response("Something went wrong! please try again", {
      status: 401,
    });
  }
}
