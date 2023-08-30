import { Database } from "@/lib/types/database.types";

export type UserInfo = Database['public']['Tables']['user_info']['Row'];

export function isPaidUser(userInfo: UserInfo | null) {
  if (!userInfo || !userInfo.current_period_end) {
    return false;
  }
  const periodEnd = new Date(userInfo.current_period_end);
  return !isNaN(periodEnd.getTime()) && new Date() < periodEnd;
}
