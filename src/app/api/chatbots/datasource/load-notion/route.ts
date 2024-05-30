import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authenticateNotion, loadNotions } from "@/modules/datasource/load-notions";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/database.types";
import { cookies } from "next/headers";
import { INotion } from "@/lib/store/use-datasource-store";
import { ChatbotNotion } from "@/lib/supabase";
import { getDevErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const chatbot_id = requestUrl.searchParams.get("chatbot_id");

    if (!code) {
      throw new Error("no-code-found");
    }
    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const notionAuth = await authenticateNotion(code);

    let notionRes = await loadNotions(notionAuth);

    // filter missing ids and make it unique by reducing to first occurrence and summing up the chars
    notionRes = notionRes
      .filter((document) => document?.id)
      .reduce<typeof notionRes>((acc, document) => {
        const existingDoc = acc.find((d) => d.id === document.id);
        if (existingDoc) {
          existingDoc.pageContent += "\n" + document.pageContent;
        } else {
          acc.push(document);
        }
        return acc;
      }, []);

    await supabaseServerClient
      .from("chatbot_notion")
      .insert(
        notionRes.map(
          (document) =>
            ({
              chars: document.pageContent.length,
              chatbot_id,
              content: document.pageContent,
              id: document.id,
              name: document.title,
              type: document.type,
            }) as ChatbotNotion,
        ),
      )
      .throwOnError();

    return NextResponse.json(
      notionRes.map(
        (document) =>
          ({
            id: document.id,
            name: document.title,
            chars: document.pageContent.length,
          }) as INotion,
      ),
    );
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot datasource error"), {
      status: 500,
    });
  }
}
