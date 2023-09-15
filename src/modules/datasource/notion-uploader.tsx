"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NOTION_AUTH_URL, popupCenter } from "@/lib/utils";
import axios from "axios";
import ContentList from "./content-list";
import { INotion, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { useSupabaseAuth } from "@/lib/store/use-user";

const NotionUploader = ({ chatbotId }: { chatbotId: string }) => {
  const [notionCode, setNotionCode] = useState("");

  const [loading, setLoading] = useState(false);

  const { notion, appendNotion, deleteNotion, deleteAllNotion } =
    useDatasourceStore((state) => ({
      notion: state.notion,
      appendNotion: state.appendNotion,
      deleteNotion: state.deleteNotion,
      deleteAllNotion: state.deleteAllNotion,
    }));
  const { supabase } = useSupabaseAuth();

  useEffect(() => {
    console.log({ notionCode });
  }, [notionCode]);

  const handleNotionConnect = async () => {
    popupCenter({
      url: NOTION_AUTH_URL,
      title: "Upload from notion",
      w: 500,
      h: 400,
    });
  };

  const handleDeleteNotion = async (n: INotion) => {
    if (n.uploaded) {
      await supabase
        .from("chatbot_notion")
        .delete()
        .eq("id", n.id)
        .eq("chatbot_id", chatbotId)
        .throwOnError();
    }
    deleteNotion(n);
  };

  const handleDeleteAllNotion = async () => {
    await supabase
      .from("chatbot_notion")
      .delete()
      .eq("chatbot_id", chatbotId)
      .throwOnError();
    deleteAllNotion();
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("here", event.origin, process.env.NEXT_PUBLIC_URL, event);
      // Verifica l'origine del messaggio
      if (event.origin !== `${process.env.NEXT_PUBLIC_URL}`) return;

      // Verifica il tipo di messaggio
      if (event.data?.["notion-code"]) {
        setNotionCode(event.data["notion-code"]);
        getNotionPages(event.data["notion-code"]);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getNotionPages = async (code: string) => {
    try {
      setLoading(true);
      const res = await axios.get<INotion[]>(
        `/api/chatbots/datasource/load-notion?code=${encodeURIComponent(code)}`,
      );
      if (res.data?.length) {
        appendNotion(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex justify-center items-center h-16">
        <Button
          type={"button"}
          onClick={handleNotionConnect}
          iconAtStart={true}
          icon={"logos:notion-icon"}
          disabled={loading}
          loading={loading}
        >
          Upload from Notion
        </Button>
      </div>

      <ContentList
        title="Loaded pages"
        items={notion.map((n) => ({
          value: n.name,
          chars: n.chars,
          id: n.id,
          uploaded: n.uploaded,
          data: n,
        }))}
        onDelete={(url) => handleDeleteNotion(url.data!)}
        onDeleteAll={() => handleDeleteAllNotion()}
      />
    </div>
  );
};

export default NotionUploader;
