import { Database } from "@/lib/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } from "./env";
import { cookies as cookiesType } from "next/headers";

export function getSupabaseClientAdmin(
  cookies: () => ReturnType<typeof cookiesType>,
) {
  return createServerComponentClient<Database>(
    {
      cookies: cookies,
    },
    {
      supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: SUPABASE_SERVICE_KEY,
    },
  );
}
