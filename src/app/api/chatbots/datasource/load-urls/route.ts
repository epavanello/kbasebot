import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { loadMultiUrl, loadSingleUrl, loadSiteMap, loadWebsites } from "@/modules/datasource/load-websites";
import { Document } from "langchain/document";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/database.types";
import { cookies } from "next/headers";
import { ChatbotUrl } from "@/lib/supabase";
import { getDevErrorMessage } from "@/lib/utils";
import { IUrl } from "@/lib/store/use-datasource-store";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// export const runtime = "nodejs";

interface AdjustedContent {
  content: string;
  url: string;
}

function adjustDocuments(documents: Document<Record<string, any>>[], content: AdjustedContent[] = []) {
  return (
    [
      ...documents.filter(Boolean).map((i) => ({
        content: i.pageContent,
        url: i.metadata.source,
      })),
      ...content,
    ]
      // se ci sono url duplicati con page content diverso, concateno il contenuto e unisco gli array items
      .reduce((acc, curr) => {
        const index = acc.findIndex((i) => i.url === curr.url);
        // i documenti restituiti devono essere univoci a parità di url, se ci sono duplicati, li ignoro
        if (index === -1) {
          acc.push(curr);
        }
        return acc;
      }, [] as AdjustedContent[])
      .filter((url) => url.content.length > 0)
  );
}

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

    let { sitemap, crawl, url } = body;

    let adjustedContent: AdjustedContent[] = [];

    if (crawl) {
      adjustedContent = adjustDocuments((await loadWebsites(crawl)) || []);
    }

    if (sitemap || crawl) {
      if (crawl) {
        sitemap = `${crawl}/sitemap.xml`;
      }
      let { sites } = await loadSiteMap(sitemap!);
      if (sites.length == 0 && sitemap?.indexOf(".xml") == -1) {
        // try to set sitemap.xml to the url and retry
        sitemap = new URL(sitemap!).origin + "/sitemap.xml";
        ({ sites } = await loadSiteMap(sitemap));
      }
      // filter out previous extracted urls
      sites.filter((site) => !adjustedContent.find((i) => i.url === site));
      adjustedContent = adjustDocuments(await loadMultiUrl(sites), adjustedContent);
    }
    if (url) {
      adjustedContent = adjustDocuments(await loadSingleUrl(url));
    }

    if (!url && !sitemap && !crawl) {
      throw new Error("no-datasource-found");
    }

    await supabaseServerClient
      .from("chatbot_urls")
      .insert(
        adjustedContent.map(
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

    return NextResponse.json(adjustedContent.map((url) => ({ chars: url.content.length, url: url.url }) as IUrl));
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot datasource error"), {
      status: 500,
    });
  }
}
