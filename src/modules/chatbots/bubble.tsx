"use client";

import { NEXT_PUBLIC_URL } from "@/lib/env";
import { Settings } from "@/lib/supabase";
import { Database } from "@/lib/types/database.types";
import { cn, isContrastColorWhite } from "@/lib/utils";
import Image from "next/image";

interface BubbleProps {
  settings: Settings;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

export function Bubble({
  settings,
  isOpen,
  onClose,
  onOpen,
  className,
}: BubbleProps) {
  return (
    <div
      className={cn("flex", className, {
        "justify-end": settings.chatbot_bubble_align === "right",
      })}
    >
      <button
        className="mt-2 w-14 h-14 rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-all duration-200 ease-in-out"
        style={{
          backgroundColor: settings.primary_color,
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px",
        }}
        onClick={() => {
          if (isOpen) {
            onClose?.();
          } else {
            onOpen?.();
          }
        }}
      >
        {!isOpen && settings.chatbot_bubble_logo ? (
          <Image
            width={32}
            height={32}
            src={settings.chatbot_bubble_logo}
            alt={"Chatbot bubble logo"}
          />
        ) : (
          <Image
            width={32}
            height={32}
            src={
              isContrastColorWhite(settings.primary_color || "#fff")
                ? isOpen
                  ? "/close-light.svg"
                  : "/bot-light.svg"
                : isOpen
                ? "/close-dark.svg"
                : "/bot-dark.svg"
            }
            alt={"Chatbot bubble logo"}
          />
        )}
      </button>
    </div>
  );
}
