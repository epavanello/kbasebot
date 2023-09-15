import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import {
  loadMultiUrl,
  loadSingleUrl,
  loadSiteMap,
  loadWebsites,
} from "@/modules/datasource/load-websites";
import { Document } from "langchain/document";
export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
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
    }
    if (url) {
      data = await loadSingleUrl(url, false);
    } else {
      throw new Error("no-datasource-found");
    }

    const loadedUrls = data.filter(Boolean).map((i) => ({
      chars: i.pageContent?.length,
      url: i.metadata.source,
    }));

    console.log({ loadedUrls });

    return NextResponse.json(loadedUrls);
  } catch (e) {
    console.error(e);
    return new Response("Chatbot datasource error", {
      status: 500,
    });
  }
}
