import { Database } from "@/lib/types/database.types";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_URL,
  SUPABASE_SERVICE_KEY,
} from "./env";

export type UserInfo = Database["public"]["Tables"]["subscriptions"]["Row"];

export function isPaidUser(userInfo: UserInfo | null) {
  if (!userInfo || !userInfo.current_period_end) {
    return false;
  }
  const periodEnd = new Date(userInfo.current_period_end);
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

export function handleSupabaseErrorAndGetData<
  TData,
  TError extends { message: string },
>({
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

export async function getUserByEmail(
  email: string,
  supabaseClientAdmin: SupabaseClient<Database>
) {
  const userID = handleSupabaseErrorAndGetData(
    await supabaseClientAdmin.rpc("get_user_id_by_email", {
      user_email: email,
    })
  );

  if (!userID) {
    return null;
  }

  const { data, error } =
    await supabaseClientAdmin.auth.admin.getUserById(userID);
  if (error) {
    throw error;
  }
  return data.user;
}

export async function getUserByEmailAndSignin(
  email: string,
  supabaseClientAdmin: SupabaseClient<Database>
) {
  let user = await getUserByEmail(email, supabaseClientAdmin);

  if (!user) {
    const { data, error } =
      await supabaseClientAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${NEXT_PUBLIC_URL}/app`,
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
          emailRedirectTo: `${NEXT_PUBLIC_URL}/app`,
        },
      })
    );
  }

  if (!user) {
    throw new Error(`User not found: email:${email}`);
  }

  return user;
}
