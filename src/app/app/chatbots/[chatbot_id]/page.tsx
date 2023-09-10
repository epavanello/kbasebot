import React from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import Link from "next/link";
import PublicChatUi from "@/modules/chatbots/chat-ui/public-chat-ui";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const Page = async ({
  params: { chatbot_id },
}: {
  params: { chatbot_id: string };
}) => {
  const settings = await getChatbotSettings(chatbot_id, cookies);

  return (
    <DashboardShell className="gap-0 pt-2 h-full flex flex-col">
      <DashboardHeader
        heading={"Chat with your chatbot"}
        className="flex-row text-center justify-center my-4 gap-6"
      >
        <Link
          href={`/app/chatbots/${chatbot_id}/share`}
          className="text-sm h-8 flex items-center rounded-md px-6 border border-primary text-primary hover:bg-primary hover:text-secondary"
        >
          Share
        </Link>
      </DashboardHeader>

      <div className="w-full flex-1 overflow-auto">
        <PublicChatUi noCloseBtn settings={settings} chatbot_id={chatbot_id} />
      </div>
    </DashboardShell>
  );
};

export default Page;
