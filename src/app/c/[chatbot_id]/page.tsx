import React from "react";
import PublicChatUi from "@/modules/chatbots/chat-ui/public-chat-ui";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";

const Page = async ({ params }) => {
  const { chatbot_id } = params;
  const settings = await getChatbotSettings(chatbot_id);

  return <PublicChatUi settings={settings} />;
};

export default Page;
