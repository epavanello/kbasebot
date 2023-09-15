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

    if (!code) {
      throw new Error("no-code-found");
    }

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

    return NextResponse.json(
      notionRes.map((document) => ({
        id: document.id,
        type: document.type,
        name: document.title,
        chars: document.pageContent.length,
      })),
    );
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
