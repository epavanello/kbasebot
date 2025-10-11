import React from "react";
import Info from "@/components/landing/info";
const features = [
  {
    name: "Easy to use",
    description: "KBaseBot is easy to use and requires no coding skills.",
  },
  {
    name: "Customizable",
    description: "KBaseBot is highly customizable and can be tailored to your needs.",
  },
  {
    name: "Powerful",
    description: "KBaseBot is powered by GPT-5, making it the most powerful chatbot in the market.",
  },
  {
    name: "Secure",
    description: "KBaseBot is secure and reliable, with 99.99% uptime guaranteed.",
  },
  {
    name: "Insightful",
    description: "KBaseBot provides you with powerful analytics to help you make data-driven decisions.",
  },
];
const Benefit = () => {
  return (
    <Info
      id="info"
      helpText={"Engage and Support Your Audience"}
      title={"Suitable for every context"}
      desc={
        "With KBaseBot, you can create chatbots that engage and support your audience in a whole new way. Whether it's answering frequently asked questions, providing product recommendations, or guiding users through complex processes, KBaseBot has got you covered."
      }
      features={features}
      dir={"rtl"}
      img="/customize.gif"
    />
  );
};

export default Benefit;
