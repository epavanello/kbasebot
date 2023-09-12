export enum Plan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
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
};

export interface Subscription {
  id: string;
  plan: Plan;
  customer_id: string;
  current_period_end: string;
}

export const getPermissions = (
  subscription: Subscription | null,
): { plan: Plan; permission: Permissions } => {
  const plan = subscription?.plan || Plan.FREE;
  return { plan, permission: PLAN_PERMISSIONS[plan] };
};
