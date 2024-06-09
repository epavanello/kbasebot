import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/database.types";
import { cookies } from "next/headers";
import { getDevErrorMessage } from "@/lib/utils";
import { IQA } from "@/lib/store/use-datasource-store";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const chatbot_id = req.nextUrl.searchParams.get("chatbot_id");

    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const { question, answer, id } = (await req.json()) as {
      question: string;
      answer: string;
      id?: string;
    };

    if (!question || !answer) {
      throw new Error("Question or answer not found");
    }

    const qa = (
      await supabaseServerClient
        .from("chatbot_qa")
        .upsert({
          question,
          answer,
          chatbot_id,
          id,
        })
        .select()
        .single()
        .throwOnError()
    ).data!;

    if (id) {
      await supabaseServerClient.from("knowledge_base").delete().eq("qa_id", id).throwOnError();
    }

    return NextResponse.json({
      question,
      answer,
      id: qa.id,
    } as IQA);
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot datasource error"), {
      status: 500,
    });
  }
}
