import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import {
  loadMultiUrl,
  loadSiteMap,
  loadWebsites,
} from "@/modules/datasource/load-websites";
export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { url, sitemap } = body;

    // if (!files?.length) throw new Error("no-files-found");
    let data;

    if (sitemap) {
      const { sites } = await loadSiteMap(sitemap);
      data = await loadMultiUrl(sites, false);
    } else {
      data = (await loadWebsites(url)) || [];
    }

    const loadedUrls = data
      .filter(Boolean)
      .map((i) => ({
        chars: i.pageContent?.length,
        url: i.metadata.source,
      }))
      .filter(Boolean);

    return NextResponse.json(loadedUrls);
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
