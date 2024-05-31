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
    <DashboardShell className="h-full pb-0">
      <DashboardHeader heading={"Preview"}>
        <Link
          href={`/app/chatbots/${chatbot_id}/share`}
          className="flex h-8 items-center rounded-md border border-primary px-6 text-sm text-primary hover:bg-primary hover:text-secondary"
        >
          Share
        </Link>
      </DashboardHeader>

      <div className="flex w-full flex-1 sm:container">
        <PublicChatUi noCloseBtn settings={settings} chatbot_id={chatbot_id} />
      </div>
    </DashboardShell>
  );
};

export default Page;
