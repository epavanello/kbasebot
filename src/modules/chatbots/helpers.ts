import { ChatCompletionRequestMessage } from "openai-edge";
import { IConversationSpeaker } from "@/lib/types/common.types";

export const convesationLogToMessages = (
  conv,
): ChatCompletionRequestMessage[] =>
  conv.map((entry) => ({
    role: entry.speaker,
    content: entry.entry,
  }));

export type IMessage = {
  id: string;
  createdAt?: Date;
  content: string;
  role: IConversationSpeaker;
  name?: string;
};

export const convesationLogToInitialMessages = (conv): IMessage[] =>
  conv.map((entry) => ({
    id: entry.id,
    createdAt: entry.created_at,
    role: entry.speaker,
    content: entry.entry,
  }));

export const truncateText = (
  inputText: string,
  maxLength: number = 20,
): string => {
  if (inputText?.length <= maxLength) {
    return inputText;
  }
  return `${inputText?.substr(0, maxLength - 3)}...`;
};

export const getChatbotPublicId = (
  id: string,
  host = process.env.NEXT_PUBLIC_REDIRECT_TO,
) => {
  return `${host}/p/chatbot-embed/${id}`;
};
