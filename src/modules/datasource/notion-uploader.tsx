"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NOTION_AUTH_URL, popupCenter } from "@/lib/utils";
import axios from "axios";
import { IUrl } from "@/lib/store/use-datasource-store";

const NotionUploader = () => {
  const [notionCode, setNotionCode] = useState("");

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

  useEffect(() => {
    const handleMessage = (event) => {
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

  const getNotionPages = async (code) => {
    const res = await axios.get(
      `/api/chatbots/datasource/load-notion?code=${encodeURIComponent(code)}`,
    );

    console.log({ data: res.data });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Button
        type={"button"}
        onClick={handleNotionConnect}
        iconAtStart={true}
        icon={"logos:notion-icon"}
      >
        Upload from Notion
      </Button>
    </div>
  );
};

export default NotionUploader;
