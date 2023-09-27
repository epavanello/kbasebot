import { prettifyGPTModelName } from "@/modules/chatbots/helpers";
import {
  STRIPE_PRICE_ID_BASIC,
  STRIPE_PRICE_ID_BASIC_YEARLY,
  STRIPE_PRICE_ID_PRO,
  STRIPE_PRICE_ID_PRO_YEARLY,
} from "./env";
import { PLAN_PERMISSIONS, Plan, getPermissions } from "./permissions/plans";

export type BillingInterval = "year" | "month";

export interface Price {
  priceId: string;
  interval: BillingInterval;
  unitAmount: number;
  discount?: string;
}

export interface PlanDetails {
  id: Plan;
  name: string;
  description?: string;
  priceText?: string;
  prices: Price[];
  features: { enabled: boolean; feature: string }[];
  highlight?: boolean;
}

const commonFeatures = [
  { enabled: true, feature: "Upload multiple files" },
  { enabled: true, feature: "View chat history" },
  { enabled: true, feature: "Embed on your website" },
];

export const plans: PlanDetails[] = [
  {
    id: Plan.FREE,
    name: "Free",
    priceText: "Start Free",
    prices: [],
    features: [
      { enabled: true, feature: "1 Chatbot" },
      {
        enabled: true,
        feature: `${PLAN_PERMISSIONS[Plan.FREE].maxMessages} messages/month`,
      },
      { enabled: false, feature: `${prettifyGPTModelName("gpt-4")}` },
      ...commonFeatures,
    ],
  },
  {
    id: Plan.BASIC,
    name: "Basic",
    prices: [
      { priceId: STRIPE_PRICE_ID_BASIC, interval: "month", unitAmount: 1499 },
      {
        priceId: STRIPE_PRICE_ID_BASIC_YEARLY,
        interval: "year",
        unitAmount: 14999,
      },
    ],
    features: [
      { enabled: true, feature: "3 Chatbots" },
      {
        enabled: true,
        feature: `${
          PLAN_PERMISSIONS[Plan.BASIC].maxMessages / 1000
        }k messages/month`,
      },
      { enabled: false, feature: `${prettifyGPTModelName("gpt-4")}` },
      ...commonFeatures,
    ],
  },
  {
    id: Plan.PRO,
    name: "Pro",
    prices: [
      {
        priceId: STRIPE_PRICE_ID_PRO,
        interval: "month",
        unitAmount: 3999,
      },
      {
        priceId: STRIPE_PRICE_ID_PRO_YEARLY,
        interval: "year",
        unitAmount: 39999,
      },
    ],
    features: [
      { enabled: true, feature: "10 Chatbots" },
      {
        enabled: true,
        feature: `${
          PLAN_PERMISSIONS[Plan.PRO].maxMessages / 1000
        }k messages/month`,
      },
      { enabled: true, feature: `${prettifyGPTModelName("gpt-4")} ✨` },
      ...commonFeatures,
    ],
    highlight: true,
  },
  {
    id: Plan.ENTERPRISE,
    name: "Enterprise",
    priceText: "Let's talk",
    prices: [],
    features: [
      { enabled: true, feature: "Unlimited Chatbots" },
      { enabled: true, feature: "Unlimited messages/month" },
      { enabled: true, feature: `${prettifyGPTModelName("gpt-4")} ✨` },
      ...commonFeatures,
    ],
  },
];
