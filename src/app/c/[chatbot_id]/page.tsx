import React from "react";
import PublicChatUi from "@/modules/chatbots/chat-ui/public-chat-ui";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    chatbot_id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { chatbot_id } = params;
  const settings = await getChatbotSettings(chatbot_id, cookies);

  return (
    <PublicChatUi settings={settings} chatbot_id={chatbot_id} forceTheme />
  );
};

export default Page;
