import { ChatMessage } from "./chat-message";
import { MessageAndSources } from "../helpers";
import { IConversationSpeaker } from "@/lib/types/common.types";

export interface ChatList {
  messages: MessageAndSources[];
  chatbotLogo?: string;
  debug?: boolean;
}

export function ChatList({ messages, chatbotLogo, debug }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return messages
    .filter((message) => message.role !== IConversationSpeaker.System)
    .map((message, index) => (
      <div key={index}>
        <ChatMessage chatbotLogo={chatbotLogo} message={message} debug={debug} />
      </div>
    ));
}
