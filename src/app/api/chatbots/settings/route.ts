import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const chatbotId = new URL(req.url).searchParams.get("chatbotId");
    if (!chatbotId) throw new Error("chatbotId is required");

    return NextResponse.json({
      status: "done",
      settings: await getChatbotSettings(chatbotId, cookies),
    });
  } catch (e) {
    console.error(e);
    if (typeof e === "string")
      return new Response(e, {
        status: 500,
      });
    else
      return new Response("Chatbot create error", {
        status: 500,
      });
  }
}
