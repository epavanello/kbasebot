import { ChatMessage } from "./chat-message";
import { MessageAndSources } from "../helpers";
import { IConversationSpeaker } from "@/lib/types/common.types";

export interface ChatList {
  messages: MessageAndSources[];
  chatbotLogo?: string;
}

export function ChatList({ messages, chatbotLogo }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return messages
    .filter((message) => message.role !== IConversationSpeaker.System)
    .map((message, index) => (
      <div key={index}>
        <ChatMessage chatbotLogo={chatbotLogo} message={message} />
      </div>
    ));
}
