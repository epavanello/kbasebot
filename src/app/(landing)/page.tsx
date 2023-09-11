import React from "react";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Cta from "@/components/landing/cta";
import Benefit from "@/components/landing/benefit";
import PublicChatUiFull from "@/modules/chatbots/chat-ui/public-chat-ui-full";
import Testimonials from "@/components/landing/testimonials";
import PricingTable from "../pricing/pricing-table";

const Page = async () => {
  return (
    <div>
      <Hero />
      <Features />
      <Benefit />
      <PricingTable />
      {/*<Testimonials />*/}
      <Cta />
      <PublicChatUiFull chatbot_id="be45f50b-fd9e-4afd-bd6a-e01ba3c80942" />
    </div>
  );
};

export default Page;
