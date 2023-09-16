"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { gradients } from "@/style/gradients";

/**
 * 6. Features list for KBaseBot, a no-code chatbot for knowledge base and customer support, trainable with pdf, docx, notion, and more. Powered by GPT-4 and GPT-3.
 * It can get leads, automate conversations, and save time.
 * It have free plan, it's customizable, and it's embeddable on your website with a single line of code.
 * You can view the conversation logs, and it's GDPR compliant.
 */
const features: { icon: string; title: string; desc: string }[] = [
  {
    icon: "fluent:bot-sparkle-24-filled",
    title: "Automated Conversations",
    desc: "KBaseBot can automate conversations with your customers, and save you time.",
  },
  {
    icon: "mdi:leads-outline",
    title: "Lead Generation",
    desc: "KBaseBot can generate leads for you, and help you grow your business.",
  },
  {
    icon: "icomoon-free:embed2",
    title: "Embeddable",
    desc: "KBaseBot can be embedded on your website with a single line of code.",
  },
  {
    icon: "gridicons:customize",
    title: "Customizable",
    desc: "KBaseBot can be customized to fit your needs, and your brand.",
  },
  {
    icon: "bxs:chat",
    title: "Conversation Logs",
    desc: "KBaseBot can log all conversations, and you can view them.",
  },
  {
    icon: "octicon:law-16",
    title: "GDPR Compliant",
    desc: "KBaseBot is GDPR compliant, and you can delete all data.",
  },
];

const Features = () => {
  return (
    <div id="features" className="py-12 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">
            Everything you need
          </h2>
          <p className="mt-2 text-5xl font-bold tracking-tight sm:text-4xl">
            Automate Conversations and Save Time
          </p>
          <p className="mt-6 text-lg leading-8">
            KBaseBot offers a wide range of features to enhance your chatbot
            experience:
          </p>
        </div>

        <section className="text-gray-900 dark:text-gray-100">
          <div className="max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
            <div className="max-w-xl"></div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.icon} className="flex items-start gap-4">
                  <span className="shrink-0 rounded-lg p-1">
                    <Icon
                      className={"text-4xl rounded-lg text-black p-2 " + gradients.SEAFOAM}
                      icon={feature.icon}
                    />
                  </span>

                  <div>
                    <h2 className="text-lg font-bold">{feature.title}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;
