"use client";

import { type Message, useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuid } from "uuid";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { convesationLogToInitialMessages } from "../helpers";
import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/ui/loading-dots";
import { ChatMessage } from "./chat-message";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  chatbot_id: string;
  id?: string;
  chatContainerClass?: string;
  welcome_message?: string;
  suggested_message?: string[];
  chatbotLogo?: string;
  resetOnIncrement?: number;
}

export default function ChatUi({
  id,
  className,
  chatContainerClass,
  welcome_message,
  suggested_message = [],
  chatbotLogo,
  chatbot_id,
  resetOnIncrement,
}: ChatProps) {
  const { toast } = useToast();

  const chatArea = useRef<HTMLDivElement | null>(null);

  const [conversation_id, setConversationId] = useLocalStorage<
    string | undefined
  >("conversation_id", undefined);

  function resetChat() {
    setConversationId(uuid());
  }

  const { supabase } = useSupabaseAuth();

  useEffect(() => {
    if (!conversation_id) {
      resetChat();
    }
  }, []);

  useEffect(() => {
    if (resetOnIncrement) {
      console.log("resetting chat");
      resetChat();
    }
  }, [resetOnIncrement]);

  const { data: conversations = [], isLoading: isDataLoading } = useQuery(
    supabase
      .from("conversations")
      .select()
      .eq("conversation_id", conversation_id || "")
      .eq("chatbot_id", chatbot_id)
      .order("created_at", { ascending: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const [responseIsStarted, setResponseIsStarted] = React.useState(false);

  const {
    messages = [],
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  } = useChat({
    api: "/api/chatbots/message",
    id: conversation_id,
    body: {
      conversationId: conversation_id,
      chatbotId: chatbot_id,
    },
    async onResponse(response) {
      if (response.status !== 200) {
        const data = (await response.json()) as { error?: string };
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            data.error ||
            "There was a problem with your request. please try again",
        });
      } else {
        setResponseIsStarted(true);
      }
    },
    onFinish() {},
    initialMessages: convesationLogToInitialMessages(
      conversations,
      welcome_message,
    ) as Message[],
  });

  // set response is complete to false when the loading state changes
  useEffect(() => {
    if (!isLoading) {
      setResponseIsStarted(false);
    }
  }, [isLoading]);

  useEffect(() => {
    chatArea?.current?.scrollTo({
      top: chatArea?.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, messages.at(-1)?.content.split("\n").length]);

  return (
    <div className={cn("flex flex-col w-full my-auto", className)}>
      <Separator className="border" />
      <div className={cn("flex-1 overflow-y-auto p-4")} ref={chatArea}>
        {isDataLoading && (
          <div className="max-w-2xl m-auto flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div className="flex flex-col gap-3" key={i.toString()}>
                <Skeleton className="w-[70%] h-[70px] rounded-2xl self-end" />
                <Skeleton className="w-[70%] h-[70px] rounded-2xl" />
              </div>
            ))}
          </div>
        )}
        {!isDataLoading && !!messages.length && (
          <div
            className={cn("w-full overflow-y-auto", chatContainerClass || "")}
          >
            <ChatList chatbotLogo={chatbotLogo} messages={messages} />
            <ChatScrollAnchor area={chatArea} trackVisibility={isLoading} />
          </div>
        )}
        {isLoading && !responseIsStarted && (
          <ChatMessage
            message={{ role: "assistant", content: "", id: "loading" }}
          >
            <LoadingDots className="!w-2 !h-2" />
          </ChatMessage>
        )}
      </div>
      {!!suggested_message?.length && (
        <div className="w-full overflow-x-auto pt-2 no-scrollbar border-t">
          <div className="flex px-2 justify-start gap-3 flex-nowrap">
            {suggested_message.map((item, idx) => (
              <Button
                variant="outline"
                title="Click to ask this"
                className="text-[10px] px-2 py-1 h-auto rounded-2xl flex-shrink-0"
                key={"suggested_message-" + idx.toString()}
                onClick={async () => {
                  await append({
                    id,
                    content: item,
                    role: "user",
                  });
                }}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}

      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        chatArea={chatArea}
      />
    </div>
  );
}
