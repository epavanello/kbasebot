import React from "react";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Cta from "@/components/landing/cta";
import Benefit from "@/components/landing/benefit";
import Script from "next/script";

const Page = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Benefit />
      <Cta />
      <Script
        src={`${process.env.NEXT_PUBLIC_URL}/embed.js?chatbot_id=be45f50b-fd9e-4afd-bd6a-e01ba3c80942`}
      />
    </div>
  );
};

export default Page;
