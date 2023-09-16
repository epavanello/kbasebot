import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import {
  loadMultiUrl,
  loadSingleUrl,
  loadSiteMap,
  loadWebsites,
} from "@/modules/datasource/load-websites";
import { Document } from "langchain/document";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/database.types";
import { cookies } from "next/headers";
import { Chatbot, ChatbotUrl } from "@/lib/supabase";
import { getDevErrorMessage } from "@/lib/utils";
import { IUrl } from "@/lib/store/use-datasource-store";
export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const chatbot_id = req.nextUrl.searchParams.get("chatbot_id");

    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const body = (await req.json()) as {
      sitemap?: string;
      crawl?: string;
      url?: string;
    };

    const { sitemap, crawl, url } = body;

    let data: Document<Record<string, any>>[] = [];

    if (sitemap) {
      const { sites } = await loadSiteMap(sitemap);
      data = await loadMultiUrl(sites);
    } else if (crawl) {
      data = (await loadWebsites(crawl)) || [];
    } else if (url) {
      data = await loadSingleUrl(url, false);
    } else {
      throw new Error("no-datasource-found");
    }

    const loadedUrls = data
      .filter(Boolean)
      .filter((url) => url.pageContent.length > 0)
      .map((i) => ({
        content: i.pageContent,
        url: i.metadata.source,
      }));

    await supabaseServerClient
      .from("chatbot_urls")
      .insert(
        loadedUrls.map(
          (document) =>
            ({
              chars: document.content.length,
              chatbot_id,
              url: document.url,
              content: document.content,
            }) as ChatbotUrl,
        ),
      )
      .throwOnError();

    return NextResponse.json(
      loadedUrls.map(
        (url) => ({ chars: url.content.length, url: url.url }) as IUrl,
      ),
    );
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot datasource error"), {
      status: 500,
    });
  }
}
