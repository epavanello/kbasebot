"use client";

import React from "react";
import { Database } from "@/lib/types/database.types";
import { Bubble } from "../bubble";
import PublicChatUi from "./public-chat-ui";
import { cn } from "@/lib/utils";

const PublicChatUiFull = ({
  settings,
  noCloseBtn,
  absolute,
  chatbot_id,
}: {
  settings: Database["public"]["Tables"]["chatbot_settings"]["Row"] | null;
  noCloseBtn?: boolean;
  absolute?: boolean;
  chatbot_id: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    settings && (
      <div
        className={cn(
          "bottom-4 h-full flex flex-col justify-end w-full max-w-md max-h-[70vh]",
          {
            "right-4": settings.chatbot_bubble_align === "right",
            "left-4": settings.chatbot_bubble_align === "left",
            absolute: absolute,
            fixed: !absolute,
          },
        )}
      >
        <div className="flex-1 overflow-auto">
          <PublicChatUi
            noCloseBtn={noCloseBtn}
            settings={settings}
            onClose={() => setIsOpen(false)}
            className={cn({ hidden: !isOpen })}
            chatbot_id={chatbot_id}
          />
        </div>

        <Bubble
          settings={settings}
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
        ></Bubble>
      </div>
    )
  );
};

export default PublicChatUiFull;
