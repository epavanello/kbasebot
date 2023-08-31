import React from "react";
import ChatUi from "@/modules/chatbots/chat-ui";

const Page = () => {
  return (
    <div className="border-2 rounded-2xl">
      <div className="flex justify-center w-full items-end h-[95vh]">
        <ChatUi />
      </div>
    </div>
  );
};

export default Page;
