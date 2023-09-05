"use client";
import React, { useEffect } from "react";

import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { sayGreeting } from "@/lib/utils";
import ChatbotList from "@/modules/chatbots/chatbot-list";
import NoItemsCard from "@/components/ui/no-items-card";
import AddModal from "@/modules/chatbots/add.modal";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { Database } from "@/lib/types/database.types";

const ChatbotIndex = ({}) => {
  const { user, supabase } = useSupabaseAuth();

  const [chatbots, setChatbots] = React.useState<
    Database["public"]["Tables"]["chatbots"]["Row"][]
  >([]);

  // Client loading, because on first load on server, cookies (and then chatbots) are empty
  useEffect(() => {
    if (user?.id) {
      supabase
        .from("chatbots")
        .select()
        .eq("user_id", user?.id)
        .then(({ data: chatbots = [] }) => {
          if (!chatbots) {
            setChatbots([]);
          } else {
            setChatbots(chatbots);
          }
        });
    }
  }, [user, supabase]);

  return (
    <DashboardShell className="container gap-0 mt-4">
      <DashboardHeader
        heading={sayGreeting()}
        text="Manage your chatbots here"
        className="flex-col md:flex-row"
      >
        <AddModal />
      </DashboardHeader>
      <div className="my-2"></div>

      {chatbots?.length ? (
        <>
          <ChatbotList chatbots={chatbots} />
        </>
      ) : (
        <NoItemsCard
          title={"Create your first Chatbot"}
          text={
            "You can train your bot with your knowledge base from different sources"
          }
        >
          <AddModal />
        </NoItemsCard>
      )}
    </DashboardShell>
  );
};

export default ChatbotIndex;
