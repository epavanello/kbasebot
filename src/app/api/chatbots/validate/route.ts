import { getDevErrorMessage } from "@/lib/utils";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { files, text, url } = body;

    // if (!files?.length) throw new Error("no-files-found");

    console.log({ files, text, url });

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return new Response(getDevErrorMessage(e, "Chatbot datasource error"), {
      status: 500,
    });
  }
}
