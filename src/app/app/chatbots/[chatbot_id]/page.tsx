import React from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import Link from "next/link";
import PublicChatUi from "@/modules/chatbots/chat-ui/public-chat-ui";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const Page = async ({ params: { chatbot_id } }: { params: { chatbot_id: string } }) => {
  const settings = await getChatbotSettings(chatbot_id, cookies);

  return (
    <DashboardShell className="pb-0 h-full">
      <DashboardHeader heading={"Preview"}>
        <Link
          href={`/app/chatbots/${chatbot_id}/share`}
          className="text-sm h-8 flex items-center rounded-md px-6 border border-primary text-primary hover:bg-primary hover:text-secondary"
        >
          Share
        </Link>
      </DashboardHeader>

      <div className="w-full flex flex-1 sm:container">
        <PublicChatUi user_id={settings?.user_id} noCloseBtn settings={settings} chatbot_id={chatbot_id} />
      </div>
    </DashboardShell>
  );
};

export default Page;
