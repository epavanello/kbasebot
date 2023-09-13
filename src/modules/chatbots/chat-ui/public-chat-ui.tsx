"use client";

import React from "react";
import ChatUi from "@/modules/chatbots/chat-ui";
import { Icon } from "@/components/ui/icons";
import { NEXT_PUBLIC_URL } from "@/lib/env";
import Image from "next/image";
import { cn, isContrastColorWhite } from "@/lib/utils";
import ChatbotTheme from "@/modules/chatbots/chat-ui/chatbot-theme";
import { Settings } from "@/lib/supabase";

const PublicChatUi = ({
  settings,
  chatbot_id,
  noCloseBtn = false,
  onClose,
  className,
}: {
  settings: Settings | null;
  chatbot_id: string;
  noCloseBtn?: boolean;
  className?: string;
  onClose?: () => void;
}) => {
  const {
    primary_color = "#000000",
    display_name,
    welcome_message,
    suggested_message,
    theme,
    chatbot_logo,
  } = settings || {};

  const [resetOnIncrement, setResetOnIncrement] = React.useState(0);

  const onCloseCallback =
    onClose ||
    (() => {
      window.parent.postMessage({ type: "close" }, "*");
    });

  const onReload = () => {
    setResetOnIncrement(resetOnIncrement + 1);
  };

  return (
    <div
      className={cn(
        "h-full flex flex-col max-w-2xl rounded-2xl border overflow-hidden m-auto bg-background",
        className,
      )}
    >
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
            {display_name || "KBaseBot"}
          </h1>
        </div>
        <div className="flex flex-row-reverse gap-4 c_text_primary_auto">
          {!noCloseBtn && (
            <Icon
              icon="mi:close"
              className="w-5 h-5 cursor-pointer hover:opacity-50 transition-opacity duration-200"
              onClick={onCloseCallback}
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
        welcome_message={welcome_message || ""}
        suggested_message={suggested_message || undefined}
        className="flex-1 min-h-0"
        chatbotLogo={chatbot_logo || undefined}
        chatbot_id={chatbot_id}
        resetOnIncrement={resetOnIncrement}
      />
      <footer className="shrink-0 bg-accent border-t  px-4 py-2">
        <div className="flex items-center justify-center gap-1.5">
          <p className="text-sm font-medium tracking-tight text-">Powered by</p>
          <div className="flex items-center gap-1 c_text_primary">
            <Icon
              icon="fluent:bot-sparkle-24-filled"
              className={cn({
                ["drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"]:
                  !isContrastColorWhite(primary_color),
              })}
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${NEXT_PUBLIC_URL}?via=widget`}
              className={cn(
                "text-sm font-semibold tracking-tight hover:underline",
                {
                  "drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]":
                    !isContrastColorWhite(primary_color),
                },
              )}
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
