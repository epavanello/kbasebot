"use client";

import { useParams } from "next/navigation";
import { type Message, useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { EmptyScreen } from "./empty-screen";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import { uuid } from "uuidv4";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { convesationLogToInitialMessages } from "../helpers";
import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  chatContainerClass?: string;
  heightPerc?: number
}

export default function ChatUi({
  id,
  className,
  chatContainerClass,
                                 heightPerc = 80,
}: ChatProps) {
  const { chatbot_id } = useParams();

  const { toast } = useToast();

  const chatArea = useRef<any>();

  const [sessionId, setSessionId] = useLocalStorage("session-id", uuid());

  const { user, supabase } = useSupabaseAuth();

  useEffect(() => {
    if (user?.id) setSessionId(user?.id);
  }, [user]);

  // @ts-ignore
  const { data: conversations = [], isLoading: isDataLoading } = useQuery(
    sessionId &&
      supabase
        .from("conversations")
        .select()
        .eq("session_id", sessionId)
        .eq("chatbot_id", chatbot_id)
        .order("created_at", { ascending: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

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
    id: sessionId,
    body: {
      sessionId: sessionId,
      chatbotId: chatbot_id,
    },
    onResponse(response) {
      if (response.status === 401) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. please try again",
        });
      }
    },
    initialMessages: convesationLogToInitialMessages(
      conversations,
    ) as Message[],
  });

  useEffect(() => {
    chatArea?.current?.scrollTo({
      top: chatArea?.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages?.length]);

  return (
    <div style={{height: `${heightPerc}vh`}} className={cn('flex flex-col w-full my-auto' , className)}>
      <div className="p-4">
        <h1 className="text-md text-primary font-bold">Name of the chat</h1>
      </div>
      <Separator className="border"/>
      <div style={{height: `${heightPerc - 15}vh`}} className={cn("flex-1 overflow-y-scroll pt-4 md:pt-10")}>
        {isDataLoading &&
            <div className="max-w-2xl m-auto flex flex-col gap-6">
              {[1,2,3].map(i =>
                  <div className="flex flex-col gap-3" key={i.toString()}>
                  <Skeleton className="w-[70%] h-[70px] rounded-2xl self-end" />
                  <Skeleton className="w-[70%] h-[70px] rounded-2xl" />
              </div>)}
            </div>
        }
        {messages.length ? (
          <div
            ref={chatArea}
            className={cn("w-full overflow-y-scroll", chatContainerClass || "")}
          >
            <ChatList messages={messages} />
            <ChatScrollAnchor area={chatArea} trackVisibility={isLoading} />
          </div>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
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
