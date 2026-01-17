import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/types/database.types";
import { NEXT_PUBLIC_SUPABASE_URL } from "./lib/env";

const internalPublicRoutes = ["/api/chatbots/message", "/api/chatbots/settings", "/api/stripe"];

export const config = {
  matcher: [`/:path*`, `/api/:path*`],
};

export async function middleware(req: NextRequest) {
  if (!NEXT_PUBLIC_SUPABASE_URL) {
    const { pathname } = req.nextUrl;

    // Allow the maintenance page itself to load
    if (pathname === "/maintenance") {
      return NextResponse.next();
    }

    // Redirect all other requests to the maintenance page
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  const res = NextResponse.next();

  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const mainPath = url.pathname.split("/").filter(Boolean)?.[0] || "";

  if (!session) {
    // handle internal public routes
    if (internalPublicRoutes.includes(url.pathname)) {
      return res;
    } else if (config.matcher.map((i) => i.split("/").filter(Boolean).shift()).includes(mainPath)) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return res;
}
