"use client";

import React from "react";
import ChatUi from "@/modules/chatbots/chat-ui";
import { Icon } from "@/components/ui/icons";
import { NEXT_PUBLIC_URL } from "@/lib/env";
import Image from "next/image";
import { textColorBasedOnBg } from "@/lib/utils";
import ChatbotTheme from "@/modules/chatbots/chat-ui/chatbot-theme";

const PublicChatUi = ({ settings, noCloseBtn = false }) => {
  const {
    primary_color,
    display_name,
    name,
    welcome_message,
    suggested_message,
    theme,
    chatbot_logo,
  } = settings || {};

  console.log({ settings });

  const onClose = () => {
    window.parent.postMessage({ type: "close" }, "*");
  };

  const onReload = () => {};

  return (
    <div className="h-full flex flex-col max-w-2xl rounded-2xl border overflow-hidden m-auto">
      <ChatbotTheme primary_color={primary_color} />
      <div className="flex justify-between p-4 c_bg_primary">
        <div className="flex gap-2 items-center">
          {!!chatbot_logo && (
            <Image
              src={chatbot_logo}
              width={32}
              height={32}
              alt={"chatbot logo"}
              className="rounded-full"
            />
          )}
          <h1 className="text-md font-bold c_text_primary_auto">
            {display_name || name || "KBaseBot"}
          </h1>
        </div>
        <div className="flex flex-row-reverse gap-4 c_text_primary_auto">
          {!noCloseBtn && (
            <Icon
              icon="mi:close"
              className="w-5 h-5 cursor-pointer hover:opacity-50 transition-opacity duration-200"
              onClick={onClose}
            />
          )}

          <Icon
            icon="fluent:arrow-sync-20-filled"
            className="w-5 h-5 cursor-pointer hover:opacity-50 transition-opacity duration-200"
            onClick={onReload}
          />
        </div>
      </div>
      <ChatUi
        welcome_message={welcome_message}
        suggested_message={suggested_message}
        className="flex-1 min-h-0"
        chatbotLogo={chatbot_logo}
      />
      <footer className="shrink-0 bg-accent border-t  px-4 py-2">
        <div className="flex items-center justify-center gap-1.5">
          <p className="text-sm font-medium tracking-tight text-">Powered by</p>
          <div className="flex items-center gap-1 c_text_primary">
            <Icon icon="fluent:bot-sparkle-24-filled" />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${NEXT_PUBLIC_URL}?via=widget`}
              className="isomorphic-link isomorphic-link--external text-sm font-semibold tracking-tight hover:underline"
            >
              KBaseBot
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicChatUi;
