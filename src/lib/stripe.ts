import { STRIPE_PRICE_ID_BASIC, STRIPE_PRICE_ID_EXTRA } from "./env";

export type PlanName = "free" | "basic" | "pro" | "agency";

export type BillingInterval = "year" | "month";

export interface Price {
  priceId: string;
  interval: BillingInterval;
  unitAmount: number;
  discount?: string;
}

export interface Plan {
  id: PlanName;
  name: string;
  description?: string;
  priceText?: string;
  prices: Price[];
  features: string[];
  highlight?: boolean;
}

const commonFeatures = [
  "Upload multiple files",
  "View chat history",
  "Embed on your website",
];

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceText: "Start Free",
    prices: [],
    features: ["1 Chatbot", "30 messages/month", ...commonFeatures],
  },
  {
    id: "basic",
    name: "Basic",
    prices: [
      { priceId: STRIPE_PRICE_ID_BASIC, interval: "month", unitAmount: 999 },
      { priceId: STRIPE_PRICE_ID_BASIC, interval: "year", unitAmount: 9999 },
    ],
    features: ["3 Chatbots", "2k messages/month", ...commonFeatures],
  },
  {
    id: "pro",
    name: "Pro",
    prices: [
      {
        priceId: STRIPE_PRICE_ID_EXTRA,
        interval: "month",
        unitAmount: 1999,
      },
      {
        priceId: STRIPE_PRICE_ID_EXTRA,
        interval: "year",
        unitAmount: 19999,
      },
    ],
    features: ["10 Chatbots", "20k messages per month", ...commonFeatures],
    highlight: true,
  },
  {
    id: "agency",
    name: "Agency",
    priceText: "Let's talk",
    prices: [],
    features: [
      "Unlimited Chatbots",
      "Unlimited messages/month",
      ...commonFeatures,
    ],
  },
];
