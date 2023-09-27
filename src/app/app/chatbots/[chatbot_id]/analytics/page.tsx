import React from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import ChatbotAnalytics from "@/modules/chatbots/chatbot-analytics";

export const dynamic = "force-dynamic";

const Page = async ({
  params: { chatbot_id },
}: {
  params: { chatbot_id: string };
}) => {
  return (
    <DashboardShell className="container max-w-3xl">
      <DashboardHeader heading={"Analytics"}></DashboardHeader>

      <ChatbotAnalytics chatbot_id={chatbot_id} />
    </DashboardShell>
  );
};

export default Page;
