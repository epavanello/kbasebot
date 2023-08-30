import React, { useEffect } from "react";

import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { sayGreeting } from "@/lib/utils";
import ChatbotList from "@/modules/chatbots/chatbot-list";
import NoItemsCard from "@/components/ui/no-items-card";
import AddModal from "@/modules/chatbots/add.modal";
import {
  createPagesBrowserClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getData() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log({ user });

  const { data: chatbots = [], error } = await supabase
    .from("chatbots")
    .select()
    .eq("user_id", user?.id);

  console.log({ error });

  return chatbots;
}

const ChatbotIndex = async ({}) => {
  const chatbots = await getData();

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
