"use-client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, LockIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  plans,
  type BillingInterval,
  type Plan,
  type Price,
} from "@/lib/stripe";
import { useSupabaseAuth } from "@/lib/store/use-user";

let tabs: { id: BillingInterval; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

export default function PricingTable() {
  const router = useRouter();
  const { user, subscription, isLoading } = useSupabaseAuth();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    tabs[0].id
  );
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price, product: any) => {
    const { metadata, id } = product;

    if (metadata?.system) {
      if (id === "basic") return router.push("/app/account");

      return router.push("/contact");
    }

    setPriceIdLoading(price.priceId);
    if (!user?.id) {
      return router.push("/auth/signin?from=/app/account/plan");
    }
    if (subscription) {
      return router.push("/app/account");
    }

    try {
      //   const { sessionId } = await postData({
      //     url: "/api/stripe/create-checkout-session",
      //     data: { price, metadata },
      //   });
      //   const stripe = await getStripe();
      //   stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!plans.length)
    return (
      <div className="pt-4">
        <Card>
          <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col sm:align-center"></div>
            <p className="flex justify-center text-2xl font-extrabold text-gray-500 sm:text-center">
              <LockIcon className="mr-4" /> Premium plan are disabled while we
              are in alpha
            </p>
          </div>
        </Card>
      </div>
    );

  return (
    <section>
      <div className="max-w-6xl mx-auto py-2 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <div className="relative self-center mt-6 bg-zinc-100 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
            {tabs.map((i) => (
              <button
                key={i.id}
                onClick={() => setBillingInterval(i.id)}
                type="button"
                className={`${
                  billingInterval === i.id
                    ? "text-white"
                    : "hover:text-gray-400"
                } relative mix-blend-multiply rounded-full px-3 py-1.5 text-sm font-medium outline-sky-400 transition focus-visible:outline-2`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {billingInterval === i.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 -z-10 bg-slate-700 rounded-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  ></motion.span>
                )}
                {i.label}ly
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {!!plans?.length && (
            <div
              className=" mt-12 place-items-start space-y-4 sm:mt-16 sm:space-y-0 sm:grid
        sm:grid-cols-2 sm:gap-6 justify-center lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4
        items-start
        "
            >
              {plans.map((plan, idx) => {
                const price = plan.prices.find(
                  (price) => price.interval === billingInterval
                );
                // if (!price && !product?.metadata?.system) return null;

                const priceString = price
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      // TODO: add currency based on user location
                      currency: "usd",
                      minimumFractionDigits: 0,
                    }).format((price.unitAmount || 0) / 100)
                  : "";

                const features = plan.features;
                const highlight = plan.highlight;
                const discount = price?.discount;

                const isBasic = plan.id === "basic";
                const isAgency = plan.id === "agency";

                let subscribeText = "Subscribe";

                if (isBasic && !!user?.id) subscribeText = "Subscribed";
                if (isAgency) subscribeText = "Contact us!";
                else if (plan.id === subscription?.plan)
                  subscribeText = "Manage";

                return (
                  <motion.div
                    key={billingInterval + plan.id}
                    className={cn("w-full rounded-xl pt-6", {
                      "border-blue-50 bg-zinc-50 border-1 shadow-md": highlight,
                    })}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 * idx,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex justify-between items-center px-4">
                      {highlight && (
                        <div className="shine-effect h-4 flex justify-center items-center px-2 bg-white rounded-sm">
                          <p className="text-[11px] text-gray-600 font-medium m-auto">
                            Recommended
                          </p>
                        </div>
                      )}
                      <p
                        className={cn(
                          "mt-4 text-primary font-bold text-xs text-right mr-2 flex flex-col",
                          { "opacity-0": !discount }
                        )}
                      >
                        <strong className="text-xl">
                          🪄 {discount || "0"}%
                        </strong>{" "}
                        <span>Discount</span>
                      </p>
                    </div>
                    <div
                      key={plan.id}
                      className={cn(
                        "rounded-lg shadow-sm divide-y divide-zinc-200",
                        {
                          "border border-green-500": subscription
                            ? plan.id === subscription?.plan
                            : plan.id === "pro",
                        }
                      )}
                    >
                      <div className="p-6">
                        <h2 className="text-2xl leading-6 font-semibold text-gray-500">
                          {plan.name}
                        </h2>
                        {plan.description && (
                          <p className="mt-4 text-zinc-600 text-md">
                            {plan.description}
                          </p>
                        )}

                        <p className={cn("mt-2")}>
                          <span
                            className={cn("text-4xl text-zinc-700 font-bold", {
                              "text-gray-600": !priceString,
                            })}
                          >
                            {priceString || plan.priceText}
                          </span>
                          {priceString && (
                            <span className="text-base font-medium text-zinc-800">
                              /month
                            </span>
                          )}
                        </p>
                        <Button
                          variant="default"
                          type="button"
                          disabled={
                            isLoading || (plan?.id === "basic" && !!user?.id)
                          }
                          loading={
                            priceIdLoading ===
                            (price?.priceId || "not-available")
                          }
                          onClick={() => handleCheckout(price!, plan)}
                          className="mt-4 bg-gray-700 block w-full rounded-md py-2 text-sm font-semibold text-gray-100 text-center hover:bg-zinc-900 hover:text-gray-100"
                        >
                          {subscribeText}
                        </Button>

                        <div className="mt-2">
                          <p>This includes</p>
                          <ul className="flex flex-col gap-2 mt-2">
                            {!!features.length &&
                              features.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-1 text-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4" /> {item}
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
