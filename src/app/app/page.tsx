"use client";

import React, { useEffect, useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { sayGreeting } from "@/lib/utils";
import ChatbotList from "@/modules/chatbots/chatbot-list";
import NoItemsCard from "@/components/ui/no-items-card";
import NewChatbotModal from "@/modules/chatbots/new-chatbot.modal";
import { useSupabaseAuth } from "@/lib/store/use-user";
import LoadingDots from "@/components/ui/loading-dots";
import { Chatbot } from "@/lib/supabase";
import { useChatbots } from "@/lib/hooks/use-chatbots";

const ChatbotIndex = () => {
  const { chatbots, loading } = useChatbots();

  return (
    <DashboardShell className="container gap-0 mt-4">
      <DashboardHeader
        heading={sayGreeting()}
        text="Manage your chatbots here"
        className="flex-col md:flex-row"
      >
        <NewChatbotModal chatbotsCreated={chatbots.length} />
      </DashboardHeader>
      <div className="my-2"></div>

      {chatbots?.length ? (
        <>
          <ChatbotList chatbots={chatbots} />
        </>
      ) : (
        <NoItemsCard
          title={loading ? "Loading chatbots..." : "Create your first Chatbot"}
          text={
            !loading
              ? ""
              : "You can train your bot with your knowledge base from different sources"
          }
        >
          {loading ? (
            <div className="mt-4">
              <LoadingDots className="!w-16 !h-16" />
            </div>
          ) : (
            <NewChatbotModal chatbotsCreated={chatbots.length} />
          )}
        </NoItemsCard>
      )}
    </DashboardShell>
  );
};

export default ChatbotIndex;
