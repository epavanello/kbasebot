import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { parseFile } from "@/modules/datasource/load-docs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { files, text, url } = body;

        // if (!files?.length) throw new Error("no-files-found");

        console.log({files, text, url})

        return NextResponse.json({  });
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
