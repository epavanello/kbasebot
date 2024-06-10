import React from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import CustomizeForm from "@/modules/chatbots/customize-form";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface CustomizeProps {
  params: {
    chatbot_id: string;
  };
}

const Customize = async ({ params }: CustomizeProps) => {
  const { chatbot_id } = params;
  const settings = await getChatbotSettings(chatbot_id, cookies);

  return (
    <DashboardShell className="container mx-auto max-w-2xl">
      <DashboardHeader heading="Customize your chatbot" text="Here you can customize your chatbot" />

      <CustomizeForm chatbotId={chatbot_id} settings={settings} />
    </DashboardShell>
  );
};

export default Customize;
