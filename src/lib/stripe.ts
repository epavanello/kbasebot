import { GPTModel, prettifyGPTModelName } from "@/modules/chatbots/helpers";
import {
  STRIPE_PRICE_ID_BASIC,
  STRIPE_PRICE_ID_BASIC_YEARLY,
  STRIPE_PRICE_ID_PRO,
  STRIPE_PRICE_ID_PRO_YEARLY,
} from "./env";
import { PLAN_PERMISSIONS, Plan } from "./permissions/plans";
import { formatNumber } from "./utils";

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
  features: { enabled?: boolean; feature: string }[];
  highlight?: boolean;
}

function formatValues(value: number) {
  if (value === -1) return "Unlimited";
  return formatNumber(value);
}

const commonFeatures = (plan: Plan) => [
  { feature: `${formatValues(PLAN_PERMISSIONS[plan].maxChatbots)} Chatbots` },
  {
    feature: `${formatValues(PLAN_PERMISSIONS[plan].maxMessages)} messages/month`,
  },
  { feature: `${formatValues(PLAN_PERMISSIONS[plan].maxLinksPerChatbot)} links/chatbot` },
  { feature: `${formatValues(PLAN_PERMISSIONS[plan].maxCharactersToTrain)} characters to train` },
  { feature: prettifyGPTModelName(GPTModel.GPT_4o_mini) },
  { enabled: PLAN_PERMISSIONS[plan].canUseGPT4o, feature: `${prettifyGPTModelName(GPTModel.GPT_4o)} ✨` },
  { enabled: PLAN_PERMISSIONS[plan].canIntegrateWebhooks, feature: "Dynamic Webhook integration" },
  { enabled: PLAN_PERMISSIONS[plan].canCaptureLeads, feature: "Capture leads" },
  { feature: "View chat history" },
  { feature: "Embed on your website" },
];

export const plans: PlanDetails[] = [
  {
    id: Plan.FREE,
    name: "Free",
    priceText: "Start Free",
    prices: [],
    features: commonFeatures(Plan.FREE),
  },
  {
    id: Plan.BASIC,
    name: "Basic",
    prices: [
      { priceId: STRIPE_PRICE_ID_BASIC, interval: "month", unitAmount: 9_79 },
      {
        priceId: STRIPE_PRICE_ID_BASIC_YEARLY,
        interval: "year",
        unitAmount: 97_90,
      },
    ],
    features: commonFeatures(Plan.BASIC),
  },
  {
    id: Plan.PRO,
    name: "Pro",
    prices: [
      {
        priceId: STRIPE_PRICE_ID_PRO,
        interval: "month",
        unitAmount: 34_79,
      },
      {
        priceId: STRIPE_PRICE_ID_PRO_YEARLY,
        interval: "year",
        unitAmount: 347_90,
      },
    ],
    features: commonFeatures(Plan.PRO),
    highlight: true,
  },
  {
    id: Plan.ENTERPRISE,
    name: "Enterprise",
    priceText: "Let's talk",
    prices: [],
    features: commonFeatures(Plan.ENTERPRISE),
  },
];
