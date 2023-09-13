import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { parseFile } from "@/modules/datasource/load-docs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { loadSingleUrl } from "@/modules/datasource/load-websites";
import { loadText } from "@/modules/datasource/load-text";
import { getErrorMessage } from "@/lib/utils";
import { Document } from "langchain/document";
import { Database } from "@/lib/types/database.types";
import { KnowledgeBase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body: {
      file?: string;
      text?: string;
      url?: string;
    } = await req.json();

    const chatbot_id = req.nextUrl.searchParams.get("chatbot_id");

    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const { file = "", text = "", url = "" } = body;

    if (!file.length && !text.length && !url.length)
      throw new Error("no-datasource-found");

    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user) {
      throw new Error("unauthorized");
    }

    const chatbot = (
      await supabaseServerClient
        .from("chatbots")
        .select()
        .eq("id", chatbot_id)
        .single()
        .throwOnError()
    ).data;

    if (!chatbot) {
      throw new Error("chatbot-not-found");
    }

    let knowledgeBaseRef: Partial<KnowledgeBase> = {
      chatbot_id: chatbot_id,
      user_id: user.id,
    };

    const documentCollection: Document[][] = [];

    if (file.length) {
      documentCollection.push(await parseFile(file, supabaseServerClient));
      knowledgeBaseRef = {
        ...knowledgeBaseRef,
        file_name: file,
      };
    } else if (text.length) {
      // cleanup previous text
      await supabaseServerClient
        .from("knowledge_base")
        .delete()
        .eq("chatbot_id", chatbot_id)
        .is("url_id", null)
        .is("file_name", null)
        .throwOnError();

      documentCollection.push(await loadText(text));
      await supabaseServerClient
        .from("chatbots")
        .update({
          text,
        })
        .eq("id", chatbot_id)
        .throwOnError();
    } else if (url) {
      const documents = await loadSingleUrl(url);
      const chars = documents.reduce(
        (acc, doc) => acc + doc.pageContent.length,
        0,
      );
      documentCollection.push(documents);

      const chatbotUrl = (
        await supabaseServerClient
          .from("chatbot_urls")
          .insert({
            chatbot_id,
            url,
            chars,
          })
          .select()
          .single()
          .throwOnError()
      ).data!;

      knowledgeBaseRef = {
        ...knowledgeBaseRef,
        url_id: chatbotUrl.id,
      };
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
                ...knowledgeBaseRef,
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
        .update(knowledgeBaseRef)
        .in("id", chunk)
        .throwOnError();

      console.log({ count });
    }

    await supabaseServerClient
      .from("chatbots")
      .update({ status: "READY" })
      .eq("id", chatbot_id);

    return NextResponse.json({ status: "done" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
