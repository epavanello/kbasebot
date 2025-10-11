import { Subscription, isPaidUser } from "../supabase";

export enum Plan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export type UserPermissions = {
  maxChatbots: number;
  maxMessages: number;
  canUseGPT4o: boolean;
  // TODO: Limit the number of links per chatbot
  maxLinksPerChatbot: number;
  maxCharactersToTrain: number;
  // TODO: Check if the user can capture leads
  canCaptureLeads: boolean;
  // TODO: Check if the user can integrate webhooks
  canIntegrateWebhooks: boolean;
};

// 0.025$ per gpt-5 message
// 0.003$ per gpt-5-mini message

export const PLAN_PERMISSIONS: Record<Plan, UserPermissions> = {
  [Plan.FREE]: {
    maxChatbots: 1,
    maxMessages: 10,
    canUseGPT4o: false,
    maxLinksPerChatbot: 5,
    maxCharactersToTrain: 5_000,
    canCaptureLeads: false,
    canIntegrateWebhooks: false,
  },
  [Plan.BASIC]: {
    maxChatbots: 2,
    maxMessages: 500,
    canUseGPT4o: false,
    maxLinksPerChatbot: 50,
    maxCharactersToTrain: 100_000,
    canCaptureLeads: true,
    canIntegrateWebhooks: false,
  },
  [Plan.PRO]: {
    maxChatbots: 5,
    maxMessages: 5_000,
    canUseGPT4o: true,
    maxLinksPerChatbot: 100,
    maxCharactersToTrain: 1_000_000,
    canCaptureLeads: true,
    canIntegrateWebhooks: true,
  },
  [Plan.ENTERPRISE]: {
    maxChatbots: -1, // Unlimited
    maxMessages: -1, // Unlimited
    canUseGPT4o: true,
    maxLinksPerChatbot: -1, // Unlimited
    maxCharactersToTrain: -1, // Unlimited
    canCaptureLeads: true,
    canIntegrateWebhooks: true,
  },
};

export const getPermissions = (subscription: Subscription | null): { plan: Plan; permission: UserPermissions } => {
  // Setting the plan directly based on whether the user is paid or not.
  const plan = isPaidUser(subscription) && subscription?.plan ? (subscription.plan as Plan) : Plan.FREE;

  return { plan, permission: PLAN_PERMISSIONS[plan] };
};
