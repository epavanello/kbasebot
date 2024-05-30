import React from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { UploadContent } from "@/modules/chatbots/upload-content";

export default function Sources({ params }: { params: { chatbot_id: string } }) {
  const { chatbot_id } = params;

  return (
    <DashboardShell className="container mx-auto  max-w-4xl">
      <DashboardHeader heading="Sources" />
      <UploadContent externalChatbotId={chatbot_id}></UploadContent>
    </DashboardShell>
  );
}
