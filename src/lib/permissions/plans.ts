import { Subscription } from "../supabase";

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
    maxMessages: 30,
    maxCharactersToTrain: 500_000,
  },
  [Plan.BASIC]: {
    maxChatbots: 5,
    maxMessages: 3_000,
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
  const plan = (subscription?.plan || Plan.FREE) as Plan;
  return { plan, permission: PLAN_PERMISSIONS[plan] };
};
