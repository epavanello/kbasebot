import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the maintenance page itself to load
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Redirect all other requests to the maintenance page
  return NextResponse.redirect(new URL("/maintenance", req.url));
}
