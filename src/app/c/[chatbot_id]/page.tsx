import React from "react";
import ChatUi from "@/modules/chatbots/chat-ui";

const Page = () => {
  return (
    <div>
      <h1 className="text-2xl font-black text-center mt-2 opacity-70">
        Chatbot Name
      </h1>
      <div className="flex justify-center w-full items-end h-[95vh]">
        <ChatUi />
      </div>
    </div>
  );
};

export default Page;
