import { ChatCompletionRequestMessage } from "openai-edge";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { Database } from "@/lib/types/database.types";

export const convesationLogToMessages = (
  conv: Database["public"]["Tables"]["conversations"]["Row"][] | null,
): ChatCompletionRequestMessage[] =>
  (conv || []).map((entry) => ({
    role: entry.speaker,
    content: entry.entry,
  })) as ChatCompletionRequestMessage[];

export type IMessage = {
  id: string;
  createdAt?: Date;
  content: string;
  role: IConversationSpeaker;
  name?: string;
};

export const convesationLogToInitialMessages = (
  conv: Database["public"]["Tables"]["conversations"]["Row"][] | null,
  welcomeMessage?: string,
): IMessage[] => {
  const msgs = welcomeMessage
    ? [
        {
          id: "welcome",
          role: IConversationSpeaker.Assistant,
          content: welcomeMessage,
        },
      ]
    : [];

  return [
    ...msgs,
    ...((conv || []).map((entry) => ({
      id: entry.id,
      createdAt: entry.created_at ? new Date(entry.created_at) : undefined,
      role: entry.speaker,
      content: entry.entry,
    })) as IMessage[]),
  ];
};

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
  host = process.env.NEXT_PUBLIC_URL,
) => {
  return `${host}/c/${id}`;
};
