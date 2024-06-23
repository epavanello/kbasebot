import { printKnowledgeBaseResponse, searchKnowledgeBase } from "@/modules/chatbots/context";
import { ChatCompletionRequestMessage } from "openai-edge";
import { HELICONE_API_KEY, OPENAI_API_KEY } from "@/lib/env";
import { SupabaseClientTyped } from "@/lib/supabase";
import OpenAi from "openai";
import { GPTModel } from "./helpers";

export const getOpenAi = (chatbotId: string, conversationId?: string) => {
  return new OpenAi({
    apiKey: OPENAI_API_KEY,
    baseURL: "https://oai.helicone.ai/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`,
      "Helicone-RateLimit-Policy": "1000;w=3600",
      "Helicone-User-Id": chatbotId,
      ...(conversationId
        ? {
            "Helicone-Property-Conversation-Id": conversationId,
          }
        : {}),
    },
  });
};

export const generateName = async (chatbotId: string, supabaseServerClient: SupabaseClientTyped) => {
  // Get Name of the chatbot
  const context = await searchKnowledgeBase("name of the topic", chatbotId, supabaseServerClient);

  // Ask OpenAI for a streaming chat completion given the prompt
  const openai = getOpenAi(chatbotId);
  const response = await openai.chat.completions.create({
    model: GPTModel.GPT_3_5_Turbo,
    messages: [
      {
        role: "system",
        content: `Respond just with the name for the context: ${printKnowledgeBaseResponse(
          context,
        )}, Give me the topic name of the context in max 2 words, topic name is?`,
      },
    ],
  });

  return (response?.choices?.[0]?.message?.content || `Untitled`)?.slice(0, 30);
};

export const standardizeQuery = async (
  lastMessages: ChatCompletionRequestMessage[],
  chatbotId: string,
  conversationId: string,
): Promise<string> => {
  const openai = getOpenAi(chatbotId, conversationId);
  const response = await openai.chat.completions.create({
    model: GPTModel.GPT_3_5_Turbo,
    messages: [
      {
        role: "system",
        content: `Your task is to read the last few user messages in the conversation and reformulate the most recent user question into a clear and specific query that includes relevant context from previous messages. Ensure the reformulated question remains in the same language as the original question and is more direct and concise. Respond only with the reformulated question.
${lastMessages.map((message) => message.role + " > " + message.content).join("\n")}
`,
      },
    ],
  });
  const newQuery = response?.choices?.[0]?.message?.content;
  if (!newQuery) {
    console.error("Failed to generate a query.");
    return lastMessages[lastMessages.length - 1].content || "";
  }

  return newQuery;
};
