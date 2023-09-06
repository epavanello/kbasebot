import React from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import CustomizeForm from "@/modules/chatbots/customize-form";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";

const Customize = async ({ params }) => {
  const { chatbot_id } = params;
  const settings = await getChatbotSettings(chatbot_id);

  return (
    <DashboardShell className="container mx-auto">
      <DashboardHeader
        heading={"Customize your chatbot"}
        className="justify-center mt-10"
      />

      <CustomizeForm chatbotId={chatbot_id} settings={settings} />
    </DashboardShell>
  );
};

export default Customize;
