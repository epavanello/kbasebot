import React, { FC, memo, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { MessageAndSources } from "../chatbots/helpers";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChatbotDoc, ChatbotNotion, ChatbotUrl, Chunk, KnowledgeBase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { PreviewContent } from "./preview-content";
import { Preview } from "./preview";

const chunkMap = new Map<string, Chunk>();

export const PreviewSources = ({ messageWithSources }: { messageWithSources: MessageAndSources }) => {
  const [chunks, setChunks] = useState<KnowledgeBase[]>([]);
  const [urls, setUrls] = useState<ChatbotUrl[]>([]);
  const [docs, setDocs] = useState<ChatbotDoc[]>([]);
  const [notions, setNotions] = useState<ChatbotNotion[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { supabase } = useSupabaseAuth();

  useEffect(() => {
    if (open) {
      setLoading(true);
      const ac = new AbortController();

      supabase
        .from("knowledge_base")
        .select("*")
        .in("id", messageWithSources.sources?.map((source) => source.id) || [])
        .abortSignal(ac.signal)
        .then(({ data, error }) => {
          if (error) console.error(error);

          if (data) {
            setChunks(data.map((chunk) => chunk));

            const urlsIds = data.map((chunk) => chunk.url_id).filter((urlId) => !!urlId) as string[];
            const docsIds = data.map((chunk) => chunk.doc_id).filter((docId) => !!docId) as string[];
            const notionsIds = data.map((chunk) => chunk.notion_id).filter((notionId) => !!notionId) as string[];

            Promise.all([
              urlsIds.length > 0
                ? supabase.from("chatbot_urls").select("*").in("id", urlsIds).throwOnError().abortSignal(ac.signal)
                : null,
              docsIds.length > 0
                ? supabase.from("chatbot_docs").select("*").in("id", docsIds).throwOnError().abortSignal(ac.signal)
                : null,
              notionsIds.length > 0
                ? supabase.from("chatbot_notion").select("*").in("id", notionsIds).throwOnError().abortSignal(ac.signal)
                : null,
            ]).then(([urlsData, docsData, notionData]) => {
              if (urlsData) setUrls(urlsData.data!);
              if (docsData) setDocs(docsData.data!);
              if (notionData) setNotions(notionData.data!);
              setLoading(false);
            });
          }
        });

      return () => {
        ac.abort();
        setLoading(false);
      };
    }
  }, [messageWithSources.sources, supabase, open]);

  return (
    <Preview icon="material-symbols:info-outline" iconClassName="absolute right-0 mr-1 mt-1" setOpen={setOpen}>
      {!loading &&
        (chunks.length > 0 ? (
          chunks.map((chunk, index) => {
            const url = urls.find((url) => url.id === chunk.url_id);
            const doc = docs.find((doc) => doc.id === chunk.doc_id);
            const notion = notions.find((notion) => notion.id === chunk.notion_id);
            return (
              <div key={index} className="flex flex-col gap-1 py-4">
                <p className="flex flex-row text-xs">
                  <span className="font-semibold">Similarity:&nbsp;</span>
                  <span>
                    {(messageWithSources.sources || []).find((source) => source.id === chunk.id)?.similarity || 0}
                  </span>
                </p>
                <p className="flex flex-row text-xs">
                  <span className="font-semibold">Source:&nbsp;</span>
                  <span>
                    {(url && (
                      <div className="inline-flex flex-row items-center gap-2">
                        <a href={url.url} target="_blank" rel="noreferrer" className="underline">
                          <PreviewContent data={url} type="url" />
                          {url.url}
                        </a>
                      </div>
                    )) ||
                      (doc && (
                        <div className="inline-flex flex-row items-center gap-2">
                          <p>
                            <PreviewContent data={doc} type="doc" />
                            {doc.file_name.split("/")?.slice(-1)[0]}
                          </p>
                        </div>
                      )) ||
                      (notion && (
                        <div className="inline-flex flex-row items-center gap-2">
                          <p>
                            <PreviewContent data={notion} type="notion" />
                            {notion.name}
                          </p>
                        </div>
                      )) ||
                      "Text"}
                  </span>
                </p>
                <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">
                  {chunk.content}
                </pre>
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs">No sources found.</p>
        ))}
    </Preview>
  );
};
