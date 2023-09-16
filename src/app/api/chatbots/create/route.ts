import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDevErrorMessage } from "@/lib/utils";
import { getPermissions } from "@/lib/permissions/plans";
import { Database } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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

    // delete all temporary chatbots
    await supabaseServerClient
      .from("chatbots")
      .delete()
      .eq("user_id", user.id)
      .eq("status", "TEMPORARY");

    const subscription = (
      await supabaseServerClient
        .from("subscriptions")
        .select()
        .maybeSingle()
        .throwOnError()
    ).data;

    const { permission } = getPermissions(subscription);

    const count =
      (
        await supabaseServerClient
          .from("chatbots")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .throwOnError()
      ).count || 0;

    if (count >= permission.maxChatbots) {
      throw new Error("max-chatbots-limit");
    }

    // @ts-ignore
    const chatbot = (
      await supabaseServerClient
        .from("chatbots")
        .insert({
          user_id: user.id,
          status: "TEMPORARY",
        })
        .select()
        .single()
        .throwOnError()
    ).data!;

    // default chatbot settings
    // @ts-ignore
    await supabaseServerClient.from("chatbot_settings").insert({
      chatbot_bubble_align: "right",
      primary_color: "#29292d",
      welcome_message: "Hello there! how can i help?",
      chatbot_id: chatbot.id,
      user_id: user?.id,
    });

    return NextResponse.json({ status: "done", chatbot });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: getDevErrorMessage(e, "Chatbot create error") },
      { status: 500 },
    );
  }
}
