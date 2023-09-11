import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { parseFile } from "@/modules/datasource/load-docs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { loadMultiUrl } from "@/modules/datasource/load-websites";
import { loadText } from "@/modules/datasource/load-text";
import { getErrorMessage } from "@/lib/utils";
import { Document } from "langchain/document";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { files = [], text = "", urls = [] } = body;

    if (!files?.length && !text?.length && !urls?.length)
      throw new Error("no-datasource-found");

    const supabaseServerClient = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user) {
      throw new Error("unauthorized");
    }

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

    const documentCollection: Document[][] = [];

    if (files?.length) {
      documentCollection.concat(await parseFile(files, supabaseServerClient));
    }
    if (text?.length) {
      documentCollection.push(await loadText(text));
    }
    if (urls?.length) {
      // TODO: lo scraper ha un timeout di default di 10s, nel caso di siti lenti,
      // bisogna gestire l'errore della singola pagina, al posto di bloccare tutto
      documentCollection.push(await loadMultiUrl(urls));
    }

    const embeddings = new OpenAIEmbeddings();

    const store = new SupabaseVectorStore(embeddings, {
      client: supabaseServerClient,
      tableName: "knowledge_base",
    });

    const docIds = (
      await Promise.all(
        documentCollection.map(async (documents) => {
          return store.addDocuments(
            documents.map((document) => ({
              ...document,
              metadata: {
                ...(document.metadata || {}),
                chatbot_id: chatbot?.id,
                user_id: user?.id,
              },
            })),
          );
        }),
      )
    ).flat();

    // THE FUNCTION ABOVE FROM LANGCHAIN CAN'T ADD ADDITIONAL COLUMN, SO NEED TO DO EXTRA STEPS
    // split docIds into chunks of 1000
    const docIdsChunks = docIds.reduce<string[][]>(
      (acc, docId, i) => {
        const chunkIndex = Math.floor(i / 1000);

        if (!acc[chunkIndex]) {
          acc[chunkIndex] = []; // start a new chunk
        }

        acc[chunkIndex].push(docId);

        return acc;
      },
      [[]],
    );

    // update chatbot_id and user_id in knowledge_base table
    for (const chunk of docIdsChunks) {
      const { count } = await supabaseServerClient
        .from("knowledge_base")
        .update({ chatbot_id: chatbot?.id, user_id: user?.id })
        .in("id", chunk)
        .throwOnError();

      console.log({ count });
    }

    // default chatbot settings
    await supabaseServerClient.from("chatbot_settings").insert({
      chatbot_bubble_align: "right",
      primary_color: "#29292d",
      welcome_message: "Hello there! how can i help?",
      chatbot_id: chatbot?.id,
      user_id: user?.id,
    });

    return NextResponse.json({ status: "done", chatbot });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
