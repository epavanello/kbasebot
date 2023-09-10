import { Database } from "@/lib/types/database.types";
import {
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
} from "./env";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function getSupabaseClientAdmin(cookies: () => ReadonlyRequestCookies) {
  return createServerComponentClient<Database>(
    {
      cookies,
    },
    {
      supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: SUPABASE_SERVICE_KEY,
    },
  );
}
