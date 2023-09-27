import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { notFound } from "next/navigation";
import ConversationsLogs from "@/modules/chatbots/conversations-logs";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { Database } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

async function getData(chatbotId: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data: conversationsPerSession, error } = await supabase.rpc(
    "get_messages_by_chatbot_id",
    {
      p_chatbot_id: chatbotId,
    },
  );

  if (error) console.error(error);

  return conversationsPerSession as Database["public"]["Functions"]["get_messages_by_chatbot_id"]["Returns"];
}
const Conversations = async ({
  params,
}: {
  params: { chatbot_id: string };
}) => {
  if (!params?.chatbot_id) notFound();

  const { chatbot_id } = params;

  const conversationsPerSession = (await getData(params?.chatbot_id)) || [];
  const settings =
    (await getChatbotSettings(params?.chatbot_id, cookies)) || {};

  const firstChatbotId = conversationsPerSession?.[0]?.chatbot_id || "";

  return (
    <DashboardShell className="h-full pb-0">
      <DashboardHeader
        heading={`Conversations (${conversationsPerSession.length})`}
      />

      <ConversationsLogs
        settings={settings}
        conversationsPerSession={conversationsPerSession}
        firstConversationId={firstChatbotId}
        chatbot_id={chatbot_id}
      />
    </DashboardShell>
  );
};

export default Conversations;
