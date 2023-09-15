import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  authenticateNotion,
  loadNotions,
} from "@/modules/datasource/load-notions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) throw new Error("no-code-found");

    const notionAuth = await authenticateNotion(code);

    const notionRes = await loadNotions(notionAuth);

    return NextResponse.json({ notionRes });
  } catch (e) {
    console.error(e);
    if (typeof e === "string")
      return new Response(e, {
        status: 500,
      });
    else
      return new Response("Chatbot datasource error", {
        status: 500,
      });
  }
}
