import React, { useEffect, useState } from "react";
import { MessageAndSources } from "../chatbots/helpers";
import { ChatbotDoc, ChatbotNotion, ChatbotQA, ChatbotUrl, Chunk, KnowledgeBase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { PreviewContent } from "./preview-content";
import { Preview } from "./preview";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const chunkMap = new Map<string, Chunk>();

export const PreviewSources = ({ messageWithSources }: { messageWithSources: MessageAndSources }) => {
  const [chunks, setChunks] = useState<KnowledgeBase[]>([]);
  const [urls, setUrls] = useState<ChatbotUrl[]>([]);
  const [docs, setDocs] = useState<ChatbotDoc[]>([]);
  const [notions, setNotions] = useState<ChatbotNotion[]>([]);
  const [qas, setQAs] = useState<ChatbotQA[]>([]);
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
            // set chunks sorted by similarity
            setChunks(
              data
                .map((chunk) => chunk)
                .sort((a, b) => {
                  const sourceA = messageWithSources.sources?.find((source) => source.id === a.id);
                  const sourceB = messageWithSources.sources?.find((source) => source.id === b.id);
                  return (sourceB?.similarity || 0) - (sourceA?.similarity || 0);
                })
                .filter((chunk) => chunk.content),
            );

            const urlsIds = data.map((chunk) => chunk.url_id).filter((urlId) => !!urlId) as string[];
            const docsIds = data.map((chunk) => chunk.doc_id).filter((docId) => !!docId) as string[];
            const notionsIds = data.map((chunk) => chunk.notion_id).filter((notionId) => !!notionId) as string[];
            const qaIds = data.map((chunk) => chunk.qa_id).filter((qaId) => !!qaId) as string[];

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
              qaIds.length > 0
                ? supabase.from("chatbot_qa").select("*").in("id", qaIds).throwOnError().abortSignal(ac.signal)
                : null,
            ]).then(([urlsData, docsData, notionData, qaData]) => {
              if (urlsData) setUrls(urlsData.data!);
              if (docsData) setDocs(docsData.data!);
              if (notionData) setNotions(notionData.data!);
              if (qaData) setQAs(qaData.data!);
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
    <Preview icon="material-symbols:info-outline" iconClassName="absolute right-0 mr-0.5 mt-0.5" setOpen={setOpen}>
      <Accordion type="single" collapsible className="w-full">
        {!loading &&
          (chunks.length > 0 ? (
            chunks.map((chunk, index) => {
              const url = urls.find((url) => url.id === chunk.url_id);
              const doc = docs.find((doc) => doc.id === chunk.doc_id);
              const notion = notions.find((notion) => notion.id === chunk.notion_id);
              const qa = qas.find((qa) => qa.id === chunk.qa_id);
              const type = url ? "url" : doc ? "doc" : notion ? "notion" : qa ? "qa" : "text";
              return (
                <AccordionItem key={chunk.id} value={chunk.id.toString()}>
                  <AccordionTrigger>
                    <div className="flex flex-col no-underline hover:no-underline">
                      <p className="flex flex-row text-xs">
                        <span className="font-semibold">Similarity:&nbsp;</span>
                        <span>
                          {(
                            ((messageWithSources.sources || []).find((source) => source.id === chunk.id)?.similarity ||
                              0) * 100
                          ).toFixed(2)}
                          %
                        </span>
                      </p>
                      <p className="flex flex-row text-xs">
                        <span className="font-semibold">Type:&nbsp;</span>
                        <span className="font-normal">
                          {
                            {
                              url: "URL",
                              doc: "Document",
                              notion: "Notion",
                              qa: "Q&A",
                              text: "Text",
                            }[type]
                          }
                        </span>
                      </p>
                      <p className="flex flex-row text-left text-xs">
                        <span className="font-normal">
                          {(url && (
                            <div className="inline-block gap-2">
                              <PreviewContent data={url} type="url" />
                              <a href={url.url} target="_blank" rel="noreferrer" className="underline">
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
                            (qa && (
                              <div className="inline-flex flex-row items-center gap-2">
                                <p>
                                  <PreviewContent data={qa} type="qa" />
                                  {qa.question}
                                </p>
                              </div>
                            ))}
                        </span>
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">
                      {chunk.content}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-center text-xs">No sources found.</p>
          ))}
      </Accordion>
    </Preview>
  );
};
