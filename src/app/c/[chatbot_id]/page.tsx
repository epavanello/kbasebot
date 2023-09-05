"use client";

import React, { useState } from "react";
import ChatUi from "@/modules/chatbots/chat-ui";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Page = () => {
  return (
    <div className="h-full">
      <div className="border rounded-2xl rounded-br-none absolute inset-0 right-4 bottom-20">
        <ChatUi />
      </div>
    </div>
  );
};

export default Page;
