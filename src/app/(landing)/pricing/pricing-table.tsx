"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { plans, type BillingInterval } from "@/lib/stripe";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { isPaidUser } from "@/lib/supabase";

let tabs: { id: BillingInterval; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

// TODO enable SSR

export default function PricingTable() {
  const { subscription } = useSupabaseAuth();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(tabs[0].id);

  return (
    <section id="pricing" className="pt-12 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="align-center flex flex-col">
          <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">Pricing Plans</h1>
          <div className="relative mt-6 flex self-center rounded-lg border border-zinc-800 bg-zinc-100 p-0.5 sm:mt-8">
            {tabs.map((i) => (
              <button
                key={i.id}
                onClick={() => setBillingInterval(i.id)}
                type="button"
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium mix-blend-multiply outline-sky-400 transition focus-visible:outline-2",
                  {
                    "text-white": billingInterval === i.id,
                    "text-gray-500": billingInterval !== i.id,
                  },
                )}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {billingInterval === i.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 -z-10 rounded-md bg-slate-700"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  ></motion.span>
                )}
                {i.label}ly
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs leading-none">Get 2 months for free by subscribing yearly!</p>
        </div>
        <AnimatePresence mode="wait">
          {!!plans?.length && (
            <div className="mt-8 place-items-start items-start justify-center space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
              {plans.map((plan, idx) => {
                const price = plan.prices.find((price) => price.interval === billingInterval);
                const priceString = price
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      // TODO: add currency based on user location
                      currency: "usd",
                      minimumFractionDigits: 2,
                    }).format((price.unitAmount || 0) / 100)
                  : "";

                const features = plan.features;
                const highlight = plan.highlight;
                const discount = price?.discount;

                const isFree = plan.id === "free";
                const isEnterprise = plan.id === "enterprise";

                let subscribeText = isPaidUser(subscription) ? "Change plan" : "Subscribe";
                let route = `/subscribe?plan=${plan.id}&interval=${billingInterval}`;
                const isActive = plan.id === subscription?.plan && billingInterval === subscription?.billing_interval;

                let info = "";

                if (isFree) {
                  subscribeText = "Get started";
                  route = "/app";
                  info = "(Free forever)";
                }
                if (isEnterprise) {
                  subscribeText = "Contact us!";
                  route = "mailto:hello@kbasebot.com";
                  info = "";
                } else if (isActive) {
                  subscribeText = "Manage";
                  route = "/app/subscription";
                }

                return (
                  <motion.div
                    key={billingInterval + plan.id}
                    className={cn("w-full rounded-xl pt-6 dark:shadow-slate-700", {
                      "border-1 border-blue-50 bg-gray-500/10 shadow-md dark:bg-gray-200/10": highlight,
                      "bg-gray-500/5 shadow-sm dark:bg-gray-200/5": !highlight,
                      "border border-primary": isActive,
                    })}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 * idx,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex items-center justify-between px-4">
                      <p
                        className={cn(
                          "shine-effect-flat h-4 self-start rounded-sm bg-background px-2 text-[11px] font-medium text-gray-600",
                          { "opacity-0": !highlight },
                        )}
                      >
                        Recommended
                      </p>

                      <p
                        className={cn("mr-2 mt-4 flex flex-col text-right text-xs font-bold text-primary", {
                          hidden: !discount,
                        })}
                      >
                        <strong className="text-xl">🪄 {discount || "0"}%</strong> <span>Discount</span>
                      </p>
                    </div>
                    <div key={plan.id} className="divide-y divide-zinc-200 rounded-lg">
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold leading-6 text-gray-500">
                          {plan.name}
                          <span className="ml-2 text-xs font-medium text-gray-500">{info}</span>
                        </h2>
                        {plan.description && <p className="text-md mt-4 text-zinc-600">{plan.description}</p>}

                        <p className={cn("mt-2")}>
                          <span
                            className={cn("text-4xl font-bold text-zinc-700 dark:text-zinc-300", {
                              "text-gray-600": !priceString,
                            })}
                          >
                            {priceString || plan.priceText}
                          </span>
                          {priceString && (
                            <span className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                              {billingInterval === "year" ? "/year" : "/month"}
                            </span>
                          )}
                        </p>
                        <a
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "mt-2 block w-full rounded-md bg-gray-700 py-2 text-center text-sm font-semibold text-gray-100 hover:bg-zinc-900 hover:text-gray-100",
                          )}
                          href={route}
                          onClick={() => {
                            window.plausible("GoToStripe", {
                              props: {
                                plan: plan.id,
                                interval: billingInterval,
                              },
                            });
                          }}
                        >
                          {subscribeText}
                        </a>

                        <div className="mt-2">
                          <p>This includes</p>
                          <ul className="mt-2 flex flex-col gap-2">
                            {!!features.length &&
                              features.map((item, i) => (
                                <li key={i} className="flex items-center gap-1 text-sm">
                                  {item.enabled === false ? (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  )}
                                  {item.feature}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
