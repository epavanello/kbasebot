import React from "react";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Cta from "@/components/landing/cta";
import Benefit from "@/components/landing/benefit";
import PublicChatUiFull from "@/modules/chatbots/chat-ui/public-chat-ui-full";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import Testimonials from "@/components/landing/testimonials";
import PricingTable from "../pricing/pricing-table";

const Page = async () => {
  const chatbotId = "be45f50b-fd9e-4afd-bd6a-e01ba3c80942";
  const settings = await getChatbotSettings(chatbotId);

  return (
    <div>
      <Hero />
      <Features />
      <Benefit />
      <PricingTable />
      <Cta />
      <Testimonials />
      <PublicChatUiFull settings={settings} chatbot_id={chatbotId} />
    </div>
  );
};

export default Page;
