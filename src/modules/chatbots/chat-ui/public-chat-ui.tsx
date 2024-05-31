"use client";

import React, { useEffect } from "react";
import ChatUi from "@/modules/chatbots/chat-ui";
import { Icon } from "@/components/ui/icons";
import { NEXT_PUBLIC_URL } from "@/lib/env";
import Image from "next/image";
import { cn, isContrastColorWhite } from "@/lib/utils";
import ChatbotTheme from "@/modules/chatbots/chat-ui/chatbot-theme";
import { Settings } from "@/lib/supabase";
import { useTheme } from "next-themes";

const PublicChatUi = ({
  settings,
  chatbot_id,
  noCloseBtn = false,
  onClose,
  className,
  forceTheme,
  externalConversationID,
}: {
  settings: Settings | null;
  chatbot_id: string;
  noCloseBtn?: boolean;
  className?: string;
  onClose?: () => void;
  forceTheme?: boolean;
  externalConversationID?: string;
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

  const { setTheme } = useTheme();

  useEffect(() => {
    if (forceTheme) {
      setTheme(theme || "light");
    }
  }, [forceTheme, theme]);

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
        "m-auto flex h-full min-h-[400px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-background",
        className,
      )}
    >
      <ChatbotTheme primary_color={primary_color} />
      <div className="c_bg_primary flex justify-between p-4">
        <div className="flex items-center gap-2">
          {!!chatbot_logo && (
            <Image src={chatbot_logo} width={32} height={32} alt={"chatbot logo"} className="rounded-full" />
          )}
          <h1 className="text-md c_text_primary_auto font-bold">{display_name || "KBaseBot"}</h1>
        </div>
        <div className="c_text_primary_auto flex flex-row-reverse gap-4">
          {!noCloseBtn && (
            <Icon
              icon="mi:close"
              className="h-5 w-5 cursor-pointer transition-opacity duration-200 hover:opacity-50"
              onClick={onCloseCallback}
            />
          )}

          <Icon
            icon="fluent:arrow-sync-20-filled"
            className="h-5 w-5 cursor-pointer transition-opacity duration-200 hover:opacity-50"
            onClick={onReload}
          />
        </div>
      </div>
      <ChatUi
        externalConversationID={externalConversationID}
        welcome_message={welcome_message || ""}
        suggested_message={suggested_message || undefined}
        className="min-h-0 flex-1"
        chatbotLogo={chatbot_logo || undefined}
        chatbot_id={chatbot_id}
        resetOnIncrement={resetOnIncrement}
      />
      <footer className="shrink-0 border-t bg-accent px-4 py-2">
        <div className="flex items-center justify-center gap-1.5">
          <p className="text- text-sm font-medium tracking-tight">Powered by</p>
          <div className="c_text_primary flex items-center gap-1">
            <Icon
              icon="fluent:bot-sparkle-24-filled"
              className={cn({
                ["drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"]: !isContrastColorWhite(primary_color),
              })}
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${NEXT_PUBLIC_URL}?via=widget`}
              className={cn("text-sm font-semibold tracking-tight hover:underline", {
                "drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]": !isContrastColorWhite(primary_color),
              })}
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
