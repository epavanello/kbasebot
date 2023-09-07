import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { notFound } from "next/navigation";
import ConversationsLogs from "@/modules/chatbots/conversations-logs";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";

export const dynamic = "force-dynamic";

async function getData(chatbotId) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversationsPerSession, error } = await supabase.rpc(
    "get_messages_by_session",
    {
      p_chatbot_id: chatbotId,
    },
  );

  if (error) console.error(error);

  return conversationsPerSession;
}
const Conversations = async ({ params }) => {
  if (!params?.chatbot_id) notFound();

  const { chatbot_id } = params;

  const conversationsPerSession = (await getData(params?.chatbot_id)) || [];
  const settings = (await getChatbotSettings(params?.chatbot_id)) || {};

  const firstSessionId = conversationsPerSession?.[0]?.session_id || "";

  return (
    <DashboardShell className="container h-full">
      <DashboardHeader heading={"Conversation Histories"} text={""} className="mt-6" />

      <ConversationsLogs
        settings={settings}
        conversationsPerSession={conversationsPerSession}
        firstSessionId={firstSessionId}
        chatbot_id={chatbot_id}
      />
    </DashboardShell>
  );
};

export default Conversations;
