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
  externalConversationID?: string;
  authToken?: string;
}

export default function ChatUi({
  id,
  externalConversationID,
  className,
  chatContainerClass,
  welcome_message,
  suggested_message = [],
  chatbotLogo,
  chatbot_id,
  resetOnIncrement,
  authToken,
}: ChatProps) {
  const { toast } = useToast();

  const chatArea = useRef<HTMLDivElement | null>(null);

  const { supabase } = useSupabaseAuth();

  const [conversation_id, setConversationId] = useLocalStorage<string | undefined>("conversation_id", undefined);

  function resetChat(uid?: string) {
    setConversationId(uid || uuid());
  }

  useEffect(() => {
    if (externalConversationID) {
      resetChat(externalConversationID);
    } else if (!conversation_id) {
      resetChat();
    }
  }, [externalConversationID]);

  useEffect(() => {
    if (resetOnIncrement) {
      resetChat();
    }
  }, [resetOnIncrement]);

  const { data: conversations = [], isLoading: isDataLoading } = useQuery(
    supabase
      .from("conversations")
      .select("speaker, entry, created_at, id")
      .eq("conversation_id", conversation_id || "")
      .eq("chatbot_id", chatbot_id)
      .order("created_at", { ascending: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  console.log({ conversations });

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
    id: `${chatbot_id}-${conversation_id}`,
    body: {
      conversationId: conversation_id,
      chatbotId: chatbot_id,
    },
    headers: {
      ...(authToken
        ? {
            "X-Auth-Token": authToken,
          }
        : {}),
    },
    async onResponse(response) {
      if (response.status !== 200) {
        const data = (await response.json()) as { error?: string };
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.error || "There was a problem with your request. please try again",
        });
      } else {
        setResponseIsStarted(true);
      }
    },
    // onFinish() {},
    initialMessages: convesationLogToInitialMessages(conversations, welcome_message) as Message[],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, messages.at(-1)?.content.split("\n").length]);

  return (
    <div className={cn("my-auto flex w-full flex-col", className)}>
      <Separator className="border" />
      <div className={cn("flex-1 overflow-y-auto p-4")} ref={chatArea}>
        {isDataLoading && (
          <div className="m-auto flex max-w-2xl flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div className="flex flex-col gap-3" key={i.toString()}>
                <Skeleton className="h-[70px] w-[70%] self-end rounded-2xl" />
                <Skeleton className="h-[70px] w-[70%] rounded-2xl" />
              </div>
            ))}
          </div>
        )}
        {!isDataLoading && !!messages.length && (
          <div className={cn("w-full overflow-y-auto", chatContainerClass || "")}>
            <ChatList chatbotLogo={chatbotLogo} messages={messages} />
            <ChatScrollAnchor area={chatArea} trackVisibility={isLoading} />
          </div>
        )}
        {isLoading && !responseIsStarted && (
          <ChatMessage message={{ role: "assistant", content: "", id: "loading" }}>
            <LoadingDots className="!h-2 !w-2" />
          </ChatMessage>
        )}
      </div>
      {!!suggested_message?.length && (
        <div className="custom-scrollbar w-full overflow-x-auto border-t pt-2">
          <div className="flex flex-nowrap justify-start gap-3 px-2">
            {suggested_message.map((item, idx) => (
              <Button
                variant="outline"
                title="Click to ask this"
                className="h-auto flex-shrink-0 rounded-2xl px-2 py-1 text-[10px]"
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
