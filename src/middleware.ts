import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/types/database.types";

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
    } else if (includedMainPaths.includes(mainPath)) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return res;
}

const internalPublicRoutes = ["/api/chatbots/message"];

const includedMainPaths = ["app", "api"];

export const config = {
  matcher: includedMainPaths.map((i) => `/${i}/:path*`),
};
