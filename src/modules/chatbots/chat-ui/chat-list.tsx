import { type Message } from "ai";
import { ChatMessage } from "./chat-message";

export interface ChatList {
  messages: Message[];
  chatbotLogo?: string;
}

export function ChatList({ messages, chatbotLogo }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return messages.map((message, index) => (
    <div key={index}>
      <ChatMessage chatbotLogo={chatbotLogo} message={message} />
    </div>
  ));
}
