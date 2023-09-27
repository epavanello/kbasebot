"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PaymentBlock from "@/components/ui/payment-block";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { UploadContent } from "./upload-content";
import axios from "axios";
import { Chatbot } from "@/lib/supabase";

const NewChatbotModal = ({ chatbotsCreated }: { chatbotsCreated: number }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Step 1
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);

  const { permission } = useSupabaseAuth();

  const isBlocked = chatbotsCreated >= permission.maxChatbots;

  useEffect(() => {
    if (isDialogOpen && permission && !isBlocked) {
      createChatbot();
    }
  }, [isDialogOpen, permission, isBlocked]);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const createChatbot = async () => {
    const res = await axios.post("/api/chatbots/create");
    const data = res.data as { chatbot: Chatbot };

    if (!data.chatbot) {
      throw new Error("Chatbot not found");
    }

    setChatbot(data.chatbot);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onDismiss={closeDialog}
      dissmissOnEsc={true}
    >
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
      >
        New chatbot
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        overlayClass="backdrop-blur-3xl bg-white\/90 bg-center bg-no-repeat bg-contain"
        className="overflow-auto md:max-w-4xl max-h-full"
      >
        <div className="w-full m-auto">
          <h1 className="mb-2 text-4xl font-black">Create New Chatbot</h1>
          <PaymentBlock
            isBlocked={isBlocked}
            text={`You have reached max ${permission.maxChatbots} Chatbot limit`}
          >
            <UploadContent
              showGoBack
              onGoBack={closeDialog}
              showCreate
              externalChatbotId={chatbot?.id}
            ></UploadContent>
          </PaymentBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatbotModal;
