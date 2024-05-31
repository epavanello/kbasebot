import React, { FC, memo, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { MessageAndSources } from "../chatbots/helpers";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChatbotDoc, ChatbotNotion, ChatbotUrl, Chunk, KnowledgeBase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/store/use-user";

const chunkMap = new Map<string, Chunk>();

export type PreviewSourcesProps = {
  id?: string;
} & (
  | {
      type: "url";
      data?: ChatbotUrl;
    }
  | {
      type: "doc";
      data?: ChatbotDoc;
    }
  | {
      type: "notion";
      data?: ChatbotNotion;
    }
);

export const PreviewContent = ({ data, type, id }: PreviewSourcesProps) => {
  const { supabase } = useSupabaseAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<ChatbotUrl | null>();
  const [doc, setDoc] = useState<ChatbotDoc | null>();
  const [notion, setNotion] = useState<ChatbotNotion | null>();

  useEffect(() => {
    if (open) {
      if (data) {
        switch (type) {
          case "url":
            setUrl(data as ChatbotUrl);
            break;
          case "doc":
            setDoc(data as ChatbotDoc);
            break;
          case "notion":
            setNotion(data as ChatbotNotion);
            break;
        }
      } else if (id) {
        switch (type) {
          case "url":
            supabase
              .from("chatbot_urls")
              .select("*")
              .eq("id", id)
              .maybeSingle()
              .throwOnError()
              .then(({ data }) => {
                setUrl(data);
              });
            break;
          case "doc":
            supabase
              .from("chatbot_docs")
              .select("*")
              .eq("id", id)
              .maybeSingle()
              .throwOnError()
              .then(({ data }) => {
                setDoc(data);
              });
            break;
          case "notion":
            supabase
              .from("chatbot_notion")
              .select("*")
              .eq("id", id)
              .maybeSingle()
              .throwOnError()
              .then(({ data }) => {
                setNotion(data);
              });
            break;
        }
      }
    }
  }, [data, id, supabase, type, open]);

  return (
    <HoverCard onOpenChange={(isOpen) => setOpen(isOpen)}>
      <HoverCardTrigger>
        <Icon icon="material-symbols:info-outline" className="c_text_primary h-4 w-4" />
      </HoverCardTrigger>
      <HoverCardContent
        className="flex max-h-screen w-[512px] flex-col divide-y overflow-auto rounded-lg bg-background"
        side="left"
      >
        {url && (
          <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{url.content}</pre>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
