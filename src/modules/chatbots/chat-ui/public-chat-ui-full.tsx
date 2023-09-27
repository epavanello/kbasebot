"use client";

import React, { useEffect } from "react";
import { Bubble } from "../bubble";
import PublicChatUi from "./public-chat-ui";
import { cn } from "@/lib/utils";
import type { Settings } from "@/lib/supabase";
import axios from "axios";

const PublicChatUiFull = ({
  externalSettings = null,
  noCloseBtn,
  absolute,
  chatbot_id,
  defaultOpen = false,
}: {
  externalSettings?: Settings | null;
  noCloseBtn?: boolean;
  absolute?: boolean;
  chatbot_id: string;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(noCloseBtn ? true : defaultOpen);
  const [settings, setSettings] = React.useState<Settings | null>(
    externalSettings,
  );
  useEffect(() => {
    if (externalSettings) {
      setSettings(externalSettings);
    } else {
      axios
        .get<{ settings: Settings }>(
          `/api/chatbots/settings?chatbotId=${chatbot_id}`,
        )
        .then(async (res) => {
          if (res.status === 200) {
            setSettings(res.data.settings);
          }
        });
    }
  }, [externalSettings]);

  return (
    settings && (
      <div
        className={cn(
          "z-[9999999] h-full bottom-0 sm:bottom-4 flex flex-col justify-end w-full sm:max-w-md sm:max-h-[70vh] pointer-events-none",
          {
            "right-0 sm:right-4": settings.chatbot_bubble_align === "right",
            "left-0 sm:left-4": settings.chatbot_bubble_align === "left",
            absolute: absolute,
            fixed: !absolute,
          },
        )}
      >
        <div
          className={cn("flex-1 overflow-auto", {
            "pointer-events-auto": isOpen,
          })}
        >
          <PublicChatUi
            noCloseBtn={noCloseBtn}
            settings={settings}
            onClose={() => setIsOpen(false)}
            className={cn({ hidden: !isOpen })}
            chatbot_id={chatbot_id}
          />
        </div>

        <Bubble
          className="pointer-events-auto p-2 sm:p-0"
          settings={settings}
          isOpen={noCloseBtn ? false : isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => !noCloseBtn && setIsOpen(false)}
        ></Bubble>
      </div>
    )
  );
};

export default PublicChatUiFull;
