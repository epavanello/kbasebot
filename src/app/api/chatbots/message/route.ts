import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { ConversationLog } from "@/modules/chatbots/conversation-log";
import { getContext } from "@/modules/chatbots/context";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { templates } from "@/modules/chatbots/templates";
import { supabaseAdminClient } from "@/lib/supabase";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextApiRequest) {
  try {
    const cookieStore = cookies();

    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    let userId = session?.user?.id;

    const { messages, sessionId, chatbotId } = await req.json();

    if (!sessionId && !userId) throw new Error("unauthorized");

    if (!userId) {
      const {
        data: { user_id: chatbotOwnerId },
      } = await supabaseAdminClient
        .from("chatbots")
        .select("user_id")
        .eq("id", chatbotId)
        .single()
        .throwOnError();

      userId = chatbotOwnerId;
    }

    const userPrompt = messages?.length ? messages[messages.length - 1] : [];

    if (!userPrompt?.content?.length)
      throw new Error("Please write a question to get answer from ai");

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(userId, sessionId, chatbotId);

    await conversationLog.addEntry({
      entry: userPrompt.content as string,
      speaker: IConversationSpeaker.User,
    });

    const conversationHistory: ChatCompletionRequestMessage[] =
      await conversationLog.getConversation({
        limit: 10,
      });

    // Get the context from the last message
    const context = await getContext(userPrompt.content, chatbotId);

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
    throw e;
    return new Response("Something went wrong! please try again", {
      status: 401,
    });
  }
}
