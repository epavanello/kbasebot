"use-client";

import { type Message } from "ai";

import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "./chat-message";

export interface ChatList {
  messages: Message[];
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative flex flex-col gap-6 mx-auto w-[32rem] md:w-[42rem] px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
        </div>
      ))}
    </div>
  );
}
