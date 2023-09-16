"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { gradients } from "@/style/gradients";

const features = [
  {
    title: "Secure Hosting",
    desc: "Experience the reliability and security of our hosting solution powered by Vercel, guaranteeing consistent uptime for your landing pages.",
    icon: "devicon:vercel-wordmark",
  },
  {
    title: "Powered By GPT-4",
    desc: "Leverage the prowess of AI for insightful, tailor-made landing pages.",
    icon: "ri:openai-fill",
  },
  {
    title: "Customizable Chatbot Design",
    desc: "Create professional landing pages effortlessly, regardless of your coding skill level.",
    icon: "tabler:drag-drop",
  },
  {
    title: "Powerful Analytics",
    desc: "Gain crucial insights with our robust analytics, driving data-informed decisions for superior outcomes. (Plausible Analytics)",
    icon: "streamline:interface-content-chart-product-data-analysis-analytics-graph-line-business-board-chart",
  },
  {
    title: "Collect Leads",
    desc: "Gather invaluable user data seamlessly with our integrated form feature.",
    icon: "fluent:form-24-regular",
  },
  {
    title: "A/B Testing Tools",
    desc: "Integrate KBaseBot seamlessly with your existing systems and databases to provide personalized and context-aware responses.",
    icon: "mdi:ab-testing",
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
              {features.map((i) => (
                <div key={i.icon} className="flex items-start gap-4">
                  <span className="shrink-0 rounded-lg bg-indigo-100 p-1">
                    <Icon
                      className={"text-4xl rounded-lg p-2 " + gradients.SEAFOAM}
                      icon={i.icon}
                    />
                  </span>

                  <div>
                    <h2 className="text-lg font-bold">{i.title}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {i.desc}
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
