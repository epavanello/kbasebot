import React from "react";
import Info from "@/components/landing/info";
const features = [
  {
    name: "Design Freedom",
    description:
      "Craft landing pages that shine on any device, ensuring an optimal browsing experience across all screen sizes.",
  },
  {
    name: "Automatic Adjustment",
    description:
      "Our builder's auto-adjust feature ensures your design elements resize and reposition based on the viewing device, providing a seamless user experience.",
  },
  {
    name: "Preview Before Publishing",
    description:
      "Use our preview feature to see how your landing page looks on various devices before publishing, ensuring it's perfect every time.",
  },
];
const Benefit = () => {
  return (
    <Info
      helpText={"Engage and Support Your Audience"}
      title={"Responsive Design"}
      desc={
        "With KBaseBot, you can create chatbots that engage and support your audience in a whole new way. Whether it's answering frequently asked questions, providing product recommendations, or guiding users through complex processes, KBaseBot has got you covered."
      }
      features={features}
      dir={"rtl"}
      img="/benefit.png"
    />
  );
};

export default Benefit;
