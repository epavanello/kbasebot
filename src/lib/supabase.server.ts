import { Database } from "@/lib/types/database.types";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } from "./env";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseClientAdmin() {
  return createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

export function getSupabaseClientAdminEdge(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient<Database>({
    req,
    res,
  });
}
