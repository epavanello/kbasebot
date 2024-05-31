import React, { FC, memo, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { MessageAndSources } from "../chatbots/helpers";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChatbotUrl, Chunk, KnowledgeBase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { PreviewContent } from "./preview-content";
import { Preview } from "./preview";

const chunkMap = new Map<string, Chunk>();

export const PreviewSources = ({ messageWithSources }: { messageWithSources: MessageAndSources }) => {
  const [chunks, setChunks] = useState<KnowledgeBase[]>([]);
  const [urls, setUrls] = useState<ChatbotUrl[]>([]);

  const { supabase } = useSupabaseAuth();

  useEffect(() => {
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

          supabase
            .from("chatbot_urls")
            .select("*")
            .in("id", urlsIds)
            .abortSignal(ac.signal)
            .then(({ data, error }) => {
              if (error) console.error(error);

              if (data) {
                setUrls(data.map((url) => url));
              }
            });
        }
      });

    return () => {
      ac.abort();
    };
  }, [messageWithSources.sources, supabase]);

  return (
    <Preview icon="material-symbols:info-outline" iconClassName="absolute right-0 mr-1 mt-1">
      {chunks.map((chunk, index) => (
        <div key={index} className="flex flex-col gap-1 py-4">
          <p className="flex flex-row text-xs">
            <span className="font-semibold">Similarity:&nbsp;</span>
            <span className="font-mono">
              {(messageWithSources.sources || []).find((source) => source.id === chunk.id)?.similarity || 0}
            </span>
          </p>
          <p className="flex flex-row text-xs">
            <span className="font-semibold">Source:&nbsp;</span>
            <span className="font-mono">
              {(
                <div className="inline-flex flex-row items-center gap-2">
                  <a
                    href={urls.find((url) => url.id === chunk.url_id)?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    <PreviewContent data={urls.find((url) => url.id === chunk.url_id)} type="url" />
                    {urls.find((url) => url.id === chunk.url_id)?.url}
                  </a>
                </div>
              ) || "Unknown"}
            </span>
          </p>
          <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{chunk.content}</pre>
        </div>
      ))}
    </Preview>
  );
};
