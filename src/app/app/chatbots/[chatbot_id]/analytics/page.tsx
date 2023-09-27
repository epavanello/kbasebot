import React from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import Link from "next/link";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";
import ChatbotAnalytics from "@/modules/chatbots/chatbot-analytics";

export const dynamic = "force-dynamic";

const Page = async ({
  params: { chatbot_id },
}: {
  params: { chatbot_id: string };
}) => {
  return (
    <DashboardShell className="container max-w-3xl">
      <DashboardHeader heading={"Preview of the chatbot"}>
        <Link
          href={`/app/chatbots/${chatbot_id}/share`}
          className="text-sm h-8 flex items-center rounded-md px-6 border border-primary text-primary hover:bg-primary hover:text-secondary"
        >
          Share
        </Link>
      </DashboardHeader>

      <ChatbotAnalytics chatbot_id={chatbot_id} />
    </DashboardShell>
  );
};

export default Page;
