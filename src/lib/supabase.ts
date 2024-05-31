import { Database } from "@/lib/types/database.types";
import { SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { NEXT_PUBLIC_URL } from "./env";
import { set } from "date-fns";

export type SupabaseClientTyped = SupabaseClient<Database>;

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Settings = Database["public"]["Tables"]["chatbot_settings"]["Row"];
export type KnowledgeBase = Database["public"]["Tables"]["knowledge_base"]["Row"];
export type Chatbot = Database["public"]["Tables"]["chatbots"]["Row"];
export type ChatbotUrl = Database["public"]["Tables"]["chatbot_urls"]["Row"];
export type ChatbotDoc = Database["public"]["Tables"]["chatbot_docs"]["Row"];
export type ChatbotNotion = Database["public"]["Tables"]["chatbot_notion"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Chunk = Database["public"]["Functions"]["match_documents"]["Returns"][0];

export function isPaidUser(subscription: Subscription | null) {
  if (!subscription || !subscription.current_period_end) {
    return false;
  }
  const periodEnd = new Date(subscription.current_period_end);
  return !isNaN(periodEnd.getTime()) && new Date() < periodEnd;
}

export function handleSupabaseError<TError extends { message: string }>({
  error,
}:
  | {
      error: null;
    }
  | {
      error: TError;
    }) {
  if (error) {
    throw new Error(error.message, {
      cause: error,
    });
  }
}

export function handleSupabaseErrorAndGetData<TData, TError extends { message: string }>({
  data,
  error,
}:
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: TError;
    }) {
  if (error) {
    throw new Error(error.message, {
      cause: error,
    });
  } else {
    return data;
  }
}

export async function getUserByEmail(email: string, supabaseClientAdmin: SupabaseClient<Database>) {
  const userID = handleSupabaseErrorAndGetData(
    await supabaseClientAdmin.rpc("get_user_id_by_email", {
      user_email: email,
    }),
  );

  if (!userID) {
    return null;
  }

  const { data, error } = await supabaseClientAdmin.auth.admin.getUserById(userID);
  if (error) {
    throw error;
  }
  return data.user;
}

export async function getUserByEmailAndSignin(email: string, supabaseClientAdmin: SupabaseClient<Database>) {
  let user = await getUserByEmail(email, supabaseClientAdmin);

  if (!user) {
    const { data, error } = await supabaseClientAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${NEXT_PUBLIC_URL}/auth`,
    });
    if (error) {
      throw error;
    }
    user = data.user;
  } else {
    handleSupabaseError(
      await supabaseClientAdmin.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${NEXT_PUBLIC_URL}/auth`,
        },
      }),
    );
  }

  if (!user) {
    throw new Error(`User not found: email:${email}`);
  }

  return user;
}

export async function countMonthlyConversationUsage(supabase: SupabaseClientTyped, userId: string) {
  return (
    (
      await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("chatbot_owner_id", userId)
        // Count messages created in the last 30 days
        .gte("created_at", set(new Date(), { date: -30 }).toISOString())
        .throwOnError()
    ).count!
  );
}

export async function countMonthlyConversationUsagePerChatbot(
  supabase: SupabaseClientTyped,
  userId: string,
  chatbotId: string,
) {
  return (
    (
      await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("chatbot_owner_id", userId)
        .eq("chatbot_id", chatbotId)
        // Count messages created in the last 30 days
        .gte("created_at", set(new Date(), { date: -30 }).toISOString())
        .throwOnError()
    ).count!
  );
}

export async function getSubscription(supabase: SupabaseClientTyped, userId?: string) {
  if (!userId) {
    return null;
  }
  return (await supabase.from("subscriptions").select("*").eq("id", userId).maybeSingle().throwOnError()).data;
}
