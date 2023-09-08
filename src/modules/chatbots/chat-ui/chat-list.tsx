"use-client";

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

  return (
    <div className="relative flex flex-col gap-0 mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage chatbotLogo={chatbotLogo} message={message} />
        </div>
      ))}
    </div>
  );
}
