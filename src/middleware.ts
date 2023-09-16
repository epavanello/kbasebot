import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/types/database.types";

const internalPublicRoutes = [
  "/api/chatbots/message",
  "/api/chatbots/settings",
  "/api/stripe",
];

export const config = {
  matcher: [`/app/:path*`, `/api/:path*`],
};

export async function middleware(req: NextRequest) {
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
    } else if (
      config.matcher
        .map((i) => i.split("/").filter(Boolean).shift())
        .includes(mainPath)
    ) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return res;
}
