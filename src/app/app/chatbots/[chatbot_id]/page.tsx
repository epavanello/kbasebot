import React from "react";
import ChatUi from "@/modules/chatbots/chat-ui";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import Link from "next/link";

const Page = ({ params }) => {
  const { chatbot_id } = params;
  return (
    <DashboardShell className="container gap-0 mt-10">
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
      <div className="flex justify-center">
        <ChatUi />
      </div>
    </DashboardShell>
  );
};

export default Page;
