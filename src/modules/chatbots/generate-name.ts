import { searchKnowledgeBase } from "@/modules/chatbots/context";
import { ChatCompletionRequestMessage } from "openai-edge";
import OpenAi from "openai";
import { OPENAI_API_KEY } from "@/lib/env";
import { SupabaseClientTyped } from "@/lib/supabase";
import { GPTModel } from "./helpers";

const openai = new OpenAi({
  apiKey: OPENAI_API_KEY,
});

export const generateName = async (chatbotId: string, supabaseServerClient: SupabaseClientTyped) => {
  // Get Name of the chatbot
  const context = await searchKnowledgeBase("name of the topic", chatbotId, supabaseServerClient);

  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `Respond just with the name for the context: ${context}, Give me the topic name of the context in max 2 words, topic name is?`,
    },
  ];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: GPTModel.GPT_3_5_Turbo,
    messages: prompt,
  });

  return (response?.choices?.[0]?.message?.content || `Untitled`)?.slice(0, 30);
};
