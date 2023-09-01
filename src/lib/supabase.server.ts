import { Database } from "@/lib/types/database.types";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_URL,
  SUPABASE_SERVICE_KEY,
} from "./env";

export function getSupabaseClientAdmin() {
  return createServerComponentClient<Database>(
    {
      cookies,
    },
    {
      supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: SUPABASE_SERVICE_KEY,
    }
  );
}
