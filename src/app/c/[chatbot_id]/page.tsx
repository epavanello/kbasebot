"use client";

import React from "react";
import ChatUi from "@/modules/chatbots/chat-ui";
import { Icon } from "@/components/ui/icons";
import { NEXT_PUBLIC_URL } from "@/lib/env";

const Page = () => {
  const onClose = () => {
    window.parent.postMessage({ type: "close" }, "*");
  };

  const onReload = () => {};

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-primary text-white">
        <h1 className="text-md font-bold">KBaseBot</h1>
        <div className="absolute top-4 right-4 flex flex-row-reverse gap-4">
          <Icon
            icon="mi:close"
            className="w-5 h-5 cursor-pointer hover:opacity-50 transition-opacity duration-200"
            onClick={onClose}
          />
          <Icon
            icon="fluent:arrow-sync-20-filled"
            className="w-5 h-5 cursor-pointer hover:opacity-50 transition-opacity duration-200"
            onClick={onReload}
          />
        </div>
      </div>
      <ChatUi className="flex-1 min-h-0" />
      <footer className="shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-center gap-1.5">
          <p className="text-sm font-medium tracking-tight text-gray-400">
            Powered by
          </p>
          <div className="flex items-center gap-1">
            <Icon
              icon="fluent:bot-sparkle-24-filled"
              className="text-primary"
            />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${NEXT_PUBLIC_URL}?via=widget`}
              className="isomorphic-link isomorphic-link--external text-sm font-semibold tracking-tight text-gray-900 hover:underline"
            >
              KBaseBot
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
