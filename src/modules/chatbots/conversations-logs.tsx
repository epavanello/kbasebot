"use client";
import React, { useState } from "react";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Button } from "@/components/ui/button";
import { truncate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatList } from "@/modules/chatbots/chat-ui/chat-list";
import { convesationLogToInitialMessages } from "@/modules/chatbots/helpers";
import { ChatScrollAnchor } from "@/modules/chatbots/chat-ui/chat-scroll-anchor";

const ConversationsLogs = ({
  conversationsPerSession,
  firstSessionId,
  chatbot_id,
}) => {
  const { supabase } = useSupabaseAuth();

  const [selectedSessionId, setSelectedSessionId] = useState(firstSessionId);

  console.log({ selectedSessionId });

  // @ts-ignore
  const { data: conversations = [], isLoading: isDataLoading } = useQuery(
    selectedSessionId
      ? supabase
          .from("conversations")
          .select()
          .eq("session_id", selectedSessionId)
          .eq("chatbot_id", chatbot_id)
          .order("created_at", { ascending: true })
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <div
      style={{ height: "calc(100vh - 65px)" }}
      className="grid md:grid-cols-[200px_1fr]"
    >
      <aside className="hidden w-[200px] flex-col gap-3 p-2 md:flex border-r">
        {!!conversationsPerSession?.length &&
          conversationsPerSession.map((item) => {
            console.log({ item });
            return (
              <Button
                key={item.session_id}
                onClick={() => setSelectedSessionId(item.session_id)}
                className="text-xs text-left justify-start p-4"
                size={"lg"}
                variant={"outline"}
              >
                {truncate(item.user_last_message, 30)}
              </Button>
            );
          })}
      </aside>

      <section className="flex w-full flex-1 flex-col overflow-auto">
        {!!conversations?.length && (
          <ScrollArea className="h-[50vh] w-full">
            <ChatList
              messages={convesationLogToInitialMessages(conversations)}
            />
            <ChatScrollAnchor trackVisibility={isDataLoading} />
          </ScrollArea>
        )}
      </section>
    </div>
  );
};

export default ConversationsLogs;
