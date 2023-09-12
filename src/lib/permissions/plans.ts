import { Subscription } from "../supabase";

export enum Plan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  AGENCY = "agency",
}

export type Permissions = {
  maxChatbots: number;
  maxMessages: number;
  maxCharactersToTrain: number;
};

export const PLAN_PERMISSIONS: Record<Plan, Permissions> = {
  [Plan.FREE]: {
    maxChatbots: 1,
    maxMessages: 100,
    maxCharactersToTrain: 500_000,
  },
  [Plan.BASIC]: {
    maxChatbots: 5,
    maxMessages: 1000,
    maxCharactersToTrain: 800_000,
  },
  [Plan.PRO]: {
    maxChatbots: 20,
    maxMessages: 5000,
    maxCharactersToTrain: 5_000_000,
  },
  [Plan.AGENCY]: {
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
