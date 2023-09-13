import React from "react";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Cta from "@/components/landing/cta";
import Benefit from "@/components/landing/benefit";
import PublicChatUiFull from "@/modules/chatbots/chat-ui/public-chat-ui-full";
import PricingTable from "./pricing/pricing-table";

const Page = async () => {
  return (
    <div>
      <Hero />
      <Features />
      <Benefit />
      <PricingTable />
      {/*<Testimonials />*/}
      <Cta />
      <PublicChatUiFull chatbot_id="1346fc11-82a6-45cc-b40a-69cc839b084e" />
    </div>
  );
};

export default Page;
