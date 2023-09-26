import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getDevErrorMessage } from "@/lib/utils";
import axios from "axios";
import { Database } from "@/lib/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { countMonthlyConversationUsagePerChatbot } from "@/lib/supabase";
export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export const getSiteStats = async (chatbotId: string) => {
  try {
    const res = await axios.get(
      `${
        process.env.PLAUSIBLE_API_URL
      }/api/v1/stats/aggregate?${new URLSearchParams({
        site_id: "kbasebot.com",
        period: "6mo",
        filters: "event:page==/c/" + chatbotId,
        metrics: "visitors,pageviews,bounce_rate,visit_duration",
      })}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
        },
      },
    );

    return res.data;
  } catch (e) {
    return null;
  }
};

export const getSiteTimeseries = async (chatbotId: string) => {
  try {
    const res = await axios.get(
      `${
        process.env.PLAUSIBLE_API_URL
      }/api/v1/stats/timeseries?${new URLSearchParams({
        site_id: "kbasebot.com",
        filters: "event:page==/c/" + chatbotId,
        metrics: "visitors,visit_duration",
      })}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PLAUSIBLE_API_KEY}`,
        },
      },
    );

    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export async function GET(req: NextRequest) {
  try {
    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user) {
      throw new Error("unauthorized");
    }

    const chatbot_id = req.nextUrl.searchParams.get("chatbot_id");

    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const [analytics, timeseries] = await Promise.all([
      getSiteStats(chatbot_id),
      getSiteTimeseries(chatbot_id),
    ]);

    const conversations = await countMonthlyConversationUsagePerChatbot(
      supabaseServerClient,
      user?.id,
      chatbot_id,
    );

    const stats = {
      ...(analytics?.results || {}),
      conversations: { value: conversations },
      timeseries,
    };

    return NextResponse.json(stats);
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot analytics error"), {
      status: 500,
    });
  }
}
