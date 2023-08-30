import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { parseFile } from "@/modules/datasource/load-docs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

// export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { files } = body;

    if (!files?.length) throw new Error("no-files-found");

    const supabaseServerClient = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user) throw new Error("auth-error");

    // TODO: check credits

    const { data: chatbot } = await supabaseServerClient
      .from("chatbots")
      .insert({
        user_id: user.id,
        status: "STARTED",
        files: files,
      })
      .select()
      .single()
      .throwOnError();

    const documentCollection = await parseFile(files, supabaseServerClient);

    const embeddings = new OpenAIEmbeddings();

    const store = new SupabaseVectorStore(embeddings, {
      client: supabaseServerClient,
      tableName: "knowledge_base",
    });

    const docIds = await Promise.all(
      documentCollection.map(async (documents) => {
        return store.addDocuments(
          documents.map((i) => ({
            ...i,
            metadata: {
              ...(i.metadata || {}),
              chatbot_id: chatbot?.id,
              user_id: user?.id,
            },
          })),
        );
      }),
    );

    // THE FUNCTION ABOVE FROM LANGCHAIN CAN'T ADD ADDITIONAL COLUMN, SO NEED TO DO EXTRA STEPS
    await supabaseServerClient
      .from("knowledge_base")
      .update({ chatbot_id: chatbot?.id })
      .in("id", docIds)
      .throwOnError();

    return NextResponse.json({ status: "done", chatbot });
  } catch (e) {
    console.error(e);
    if (typeof e === "string")
      return new Response(e, {
        status: 500,
      });
    else
      return new Response("Chatbot create error", {
        status: 500,
      });
  }
}
