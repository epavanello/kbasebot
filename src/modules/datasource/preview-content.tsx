import React, { FC, memo, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { MessageAndSources } from "../chatbots/helpers";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChatbotDoc, ChatbotNotion, ChatbotQA, ChatbotUrl, Chunk, KnowledgeBase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { Preview } from "./preview";

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
  | {
      type: "qa";
      data?: ChatbotQA;
    }
);

export const PreviewContent = ({ data, type, id }: PreviewSourcesProps) => {
  const { supabase } = useSupabaseAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<ChatbotUrl | null>();
  const [doc, setDoc] = useState<ChatbotDoc | null>();
  const [notion, setNotion] = useState<ChatbotNotion | null>();
  const [qa, setQA] = useState<ChatbotQA | null>();

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
          case "qa":
            setQA(data as ChatbotQA);
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
          case "qa":
            supabase
              .from("chatbot_qa")
              .select("*")
              .eq("id", id)
              .maybeSingle()
              .throwOnError()
              .then(({ data }) => {
                setQA(data);
              });
            break;
        }
      }
    }
  }, [data, id, supabase, type, open]);

  return (
    <Preview
      icon="material-symbols:info-outline"
      iconClassName="inline-block mr-2"
      setOpen={(isOpen) => setOpen(isOpen)}
    >
      {url && (
        <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{url.content}</pre>
      )}
      {doc && (
        <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{doc.content}</pre>
      )}
      {notion && (
        <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{notion.content}</pre>
      )}
      {qa && (
        <>
          <label className="text-xs font-bold">Question</label>
          <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{qa.question}</pre>
          <label className="text-xs font-bold">Answer</label>
          <pre className="whitespace-break-spaces break-words rounded-sm bg-secondary p-2 text-xs">{qa.answer}</pre>
        </>
      )}
    </Preview>
  );
};
