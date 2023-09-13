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
}: {
  externalSettings?: Settings | null;
  noCloseBtn?: boolean;
  absolute?: boolean;
  chatbot_id: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(noCloseBtn ? true : false);
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
          "bottom-4 h-full flex flex-col justify-end w-full max-w-md max-h-[70vh] pointer-events-none",
          {
            "right-4": settings.chatbot_bubble_align === "right",
            "left-4": settings.chatbot_bubble_align === "left",
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
          className="pointer-events-auto"
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
