import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getChatbotSettings } from "@/modules/chatbots/services.chatbot";
import { cookies } from "next/headers";
import { getDevErrorMessage, isDevelopment } from "@/lib/utils";

export const revalidate = isDevelopment ? 0 : 3600;

export async function GET(req: NextRequest) {
  try {
    const chatbotId = new URL(req.url).searchParams.get("chatbotId");
    if (!chatbotId) throw new Error("chatbotId is required");

    return NextResponse.json(
      {
        status: "done",
        settings: await getChatbotSettings(chatbotId, cookies),
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    );
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot create error"), {
      status: 500,
    });
  }
}
