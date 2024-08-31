import { IConversationSpeaker } from "@/lib/types/common.types";
import { Conversation } from "@/lib/supabase";
import { NEXT_PUBLIC_URL } from "@/lib/env";
import { Message } from "ai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const convesationLogToMessages = (
  conv: Pick<Conversation, "speaker" | "entry">[] | null,
): ChatCompletionMessageParam[] =>
  (conv || []).map((entry) => ({
    role: entry.speaker,
    content: entry.entry,
  })) as ChatCompletionMessageParam[];

export type Source = {
  id: number;
  similarity: number;
};

export type MessageAndSources = {
  sources?: Source[];
  metadata?: {
    arguments: Record<string, any>;
    response: any;
  };
  role: IConversationSpeaker;
} & Omit<Message, "role">;

export const convesationLogToInitialMessages = (
  conv: Pick<Conversation, "speaker" | "entry" | "created_at" | "id" | "sources" | "metadata">[] | null,
  welcomeMessage?: string,
): MessageAndSources[] => {
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
      sources: entry.sources,
      metadata: entry.metadata,
    })) as MessageAndSources[]),
  ];
};

export const truncateText = (inputText: string, maxLength: number = 20): string => {
  if (inputText?.length <= maxLength) {
    return inputText;
  }
  return `${inputText?.substr(0, maxLength - 3)}...`;
};

export const getChatbotPublicId = (id: string, host = NEXT_PUBLIC_URL) => {
  return `${host}/c/${id}`;
};

export enum GPTModel {
  GPT_4o_mini = "gpt-4o-mini",
  GPT_4o = "gpt-4o",
}

export const GPTModels = [GPTModel.GPT_4o_mini, GPTModel.GPT_4o];

export const prettifyGPTModelName = (name: GPTModel) => {
  switch (GPTModels.includes(name as GPTModel) ? name : GPTModel.GPT_4o_mini) {
    case GPTModel.GPT_4o:
      return "GPT-4o";
    case GPTModel.GPT_4o_mini:
    default:
      return "GPT-4o mini";
  }
};
