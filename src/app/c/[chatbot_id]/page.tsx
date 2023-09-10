import React from "react";
import PublicChatUi from "@/modules/chatbots/chat-ui/public-chat-ui";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";

interface PageProps {
  params: {
    chatbot_id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { chatbot_id } = params;
  const settings = await getChatbotSettings(chatbot_id);

  return <PublicChatUi settings={settings} chatbot_id={chatbot_id} />;
};

export default Page;
