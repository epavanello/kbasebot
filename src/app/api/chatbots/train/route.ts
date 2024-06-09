import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { loadText } from "@/modules/datasource/load-text";
import { getDevErrorMessage } from "@/lib/utils";
import { Document } from "langchain/document";
import { Database } from "@/lib/types/database.types";
import { Chatbot, KnowledgeBase } from "@/lib/supabase";
import { generateName } from "@/modules/chatbots/generate-name";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body: {
      file?: string;
      text?: string;
      url?: string;
      notion?: string;
      qa?: string;
    } = await req.json();

    const chatbot_id = req.nextUrl.searchParams.get("chatbot_id");

    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const { file = "", text = "", url = "", notion = "", qa = "" } = body;

    if (!file.length && !text.length && !url.length && !notion.length && !qa.length) {
      throw new Error("no-content-found");
    }

    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user) {
      throw new Error("unauthorized");
    }

    const chatbot = (await supabaseServerClient.from("chatbots").select().eq("id", chatbot_id).single().throwOnError())
      .data;

    if (!chatbot) {
      throw new Error("chatbot-not-found");
    }

    let knowledgeBaseRef: Partial<KnowledgeBase> = {
      chatbot_id: chatbot_id,
      user_id: user.id,
    };

    let metadata: Partial<{
      source: string;
    }> = {};

    const documentCollection: Document[][] = [];

    if (text.length) {
      // cleanup previous text
      await supabaseServerClient
        .from("knowledge_base")
        .delete()
        .eq("chatbot_id", chatbot_id)
        .is("url_id", null)
        .is("file_name", null)
        .is("doc_id", null)
        .is("notion_id", null)
        .is("qa_id", null)
        .throwOnError();

      documentCollection.push(await loadText(text));
      await supabaseServerClient
        .from("chatbots")
        .update({
          text,
        })
        .eq("id", chatbot_id)
        .throwOnError();
    } else if (file) {
      const chatbotDoc = (
        await supabaseServerClient
          .from("chatbot_docs")
          .select()
          .eq("chatbot_id", chatbot_id)
          .eq("id", file)
          .single()
          .throwOnError()
      ).data!;

      documentCollection.push(await loadText(chatbotDoc.content));

      knowledgeBaseRef = {
        ...knowledgeBaseRef,
        doc_id: chatbotDoc.id,
      };
    } else if (url) {
      const chatbotUrl = (
        await supabaseServerClient
          .from("chatbot_urls")
          .select()
          .eq("chatbot_id", chatbot_id)
          .eq("url", url)
          .single()
          .throwOnError()
      ).data!;

      documentCollection.push(await loadText(chatbotUrl.content));

      knowledgeBaseRef = {
        ...knowledgeBaseRef,
        url_id: chatbotUrl.id,
      };
      metadata = {
        ...metadata,
        source: chatbotUrl.url,
      };
    } else if (notion) {
      const chatbotNotion = (
        await supabaseServerClient
          .from("chatbot_notion")
          .select()
          .eq("chatbot_id", chatbot_id)
          .eq("id", notion)
          .single()
          .throwOnError()
      ).data!;

      documentCollection.push(await loadText(chatbotNotion.name + "\n\n" + chatbotNotion.content));

      knowledgeBaseRef = {
        ...knowledgeBaseRef,
        notion_id: chatbotNotion.id,
      };
    } else if (qa) {
      const chatbotQA = (
        await supabaseServerClient
          .from("chatbot_qa")
          .select()
          .eq("chatbot_id", chatbot_id)
          .eq("id", qa)
          .single()
          .throwOnError()
      ).data!;

      documentCollection.push(await loadText(chatbotQA.question + "\n\n" + chatbotQA.answer));

      knowledgeBaseRef = {
        ...knowledgeBaseRef,
        qa_id: chatbotQA.id,
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
                ...metadata,
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
    }

    let chatbotChanges: Partial<Chatbot> = {};
    if (chatbot.status !== "READY") {
      chatbotChanges = {
        status: "READY",
      };
    }
    if (!chatbot.name) {
      const chatbotName = await generateName(chatbot_id, supabaseServerClient);
      chatbotChanges = {
        ...chatbotChanges,
        name: chatbotName,
      };
    }

    if (Object.keys(chatbotChanges).length) {
      await supabaseServerClient.from("chatbots").update(chatbotChanges).eq("id", chatbot_id).throwOnError();
    }

    return NextResponse.json({ status: "done" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: getDevErrorMessage(e, "Chatbot upload error") }, { status: 500 });
  }
}
