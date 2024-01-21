import { Subscription, isPaidUser } from "../supabase";

export enum Plan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export type Permissions = {
  maxChatbots: number;
  maxMessages: number;
  maxCharactersToTrain: number;
};

export const PLAN_PERMISSIONS: Record<Plan, Permissions> = {
  [Plan.FREE]: {
    maxChatbots: 1,
    maxMessages: 500,
    maxCharactersToTrain: 500_000,
  },
  [Plan.BASIC]: {
    maxChatbots: 5,
    maxMessages: 10_000,
    maxCharactersToTrain: 800_000,
  },
  [Plan.PRO]: {
    maxChatbots: 20,
    maxMessages: 20_000,
    maxCharactersToTrain: 5_000_000,
  },
  [Plan.ENTERPRISE]: {
    maxChatbots: 0,
    maxMessages: 0,
    maxCharactersToTrain: 0,
  },
};

export const getPermissions = (
  subscription: Subscription | null,
): { plan: Plan; permission: Permissions } => {
  // Setting the plan directly based on whether the user is paid or not.
  const plan =
    isPaidUser(subscription) && subscription?.plan
      ? (subscription.plan as Plan)
      : Plan.FREE;

  return { plan, permission: PLAN_PERMISSIONS[plan] };
};
