import { getContext } from "@/modules/chatbots/context";
import { ChatCompletionRequestMessage } from "openai-edge";
import OpenAi from "openai";
import { HELICONE_API_KEY, OPENAI_API_KEY } from "@/lib/env";

const openai = new OpenAi({
  apiKey: OPENAI_API_KEY,
  basePath: "https://oai.hconeai.com/v1",
  baseOptions: {
    headers: {
      "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`,
      "Helicone-RateLimit-Policy": "1000;w=3600",
    },
  },
});

export const generateName = async (chatbotId, supabaseServerClient) => {
  // Get Name of the chatbot
  const context = await getContext(
    "name of the topic",
    chatbotId,
    supabaseServerClient,
  );

  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `Respond just with the name for the context: ${context}, Give me the topic name of the context in max 2 words, topic name is?`,
    },
  ];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: prompt,
  });

  console.log({ response: response?.choices?.[0]?.message });

  return (response?.choices?.[0]?.message?.content || `Untitled`)?.slice(0, 30);
};
