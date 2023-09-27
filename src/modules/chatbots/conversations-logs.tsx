"use client";
import React, { useRef, useState } from "react";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Button } from "@/components/ui/button";
import { truncate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatList } from "@/modules/chatbots/chat-ui/chat-list";
import { convesationLogToInitialMessages } from "@/modules/chatbots/helpers";
import { ChatScrollAnchor } from "@/modules/chatbots/chat-ui/chat-scroll-anchor";
import { formatDistance } from "date-fns";
import ChatbotTheme from "@/modules/chatbots/chat-ui/chatbot-theme";
import { Database } from "@/lib/types/database.types";

const ConversationsLogs = ({
  conversationsPerSession,
  firstConversationId,
  chatbot_id,
  settings,
}: {
  conversationsPerSession: Database["public"]["Functions"]["get_messages_by_chatbot_id"]["Returns"];
  firstConversationId: string;
  chatbot_id: string;
  settings: any;
}) => {
  const { supabase } = useSupabaseAuth();

  const [selectedConversationId, setSelectedConversationId] =
    useState(firstConversationId);
    const chatArea = useRef<HTMLDivElement | null>(null);

  // @ts-ignore
  const { data: conversations = [], isLoading: isDataLoading } = useQuery(
    selectedConversationId
      ? supabase
          .from("conversations")
          .select()
          .eq("conversation_id", selectedConversationId)
          .eq("chatbot_id", chatbot_id)
          .order("created_at", { ascending: true })
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] flex-1 overflow-auto">
      <ChatbotTheme primary_color={settings.primary_color} />
      <ScrollArea className="h-full border">
        <aside className="w-full md:w-[300px] flex-col gap-3 p-4 flex h-full overflow-auto">
          {!!conversationsPerSession?.length &&
            conversationsPerSession.map((item) => {
              return (
                <Button
                  key={item.conversation_id}
                  onClick={() =>
                    setSelectedConversationId(item.conversation_id)
                  }
                  className="text-xs text-left items-start py-2 px-4 flex-col h-auto"
                  size={"lg"}
                  variant={
                    item.conversation_id === selectedConversationId
                      ? "default"
                      : "outline"
                  }
                >
                  {truncate(item.user_last_message, 30)}
                  <small>
                    {formatDistance(new Date(item.sent_at), new Date(), {
                      addSuffix: true,
                    })}
                  </small>
                </Button>
              );
            })}
        </aside>
      </ScrollArea>

      <section className="flex w-full flex-1 flex-col h-full overflow-auto">
        {!!conversations?.length && (
          <ScrollArea className="w-full h-full overflow-hidden p-4" ref={chatArea}>
            <ChatList
              messages={convesationLogToInitialMessages(conversations)}
            />
            <ChatScrollAnchor trackVisibility={isDataLoading} area={chatArea} />
          </ScrollArea>
        )}
      </section>
    </div>
  );
};

export default ConversationsLogs;
