"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PaymentBlock from "@/components/ui/payment-block";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { UploadContent } from "./upload-content";

const NewChatbotModal = ({ chatbotsCreated }: { chatbotsCreated: number }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Step 1

  const { permission } = useSupabaseAuth();

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onDismiss={closeDialog}
      dissmissOnEsc={true}
    >
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }), "mt-4")}
      >
        New chatbot
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        overlayClass="backdrop-blur-3xl bg-white\/90 bg-center bg-no-repeat bg-contain"
        className="overflow-visible md:max-w-4xl"
      >
        <div className="w-full m-auto">
          <h1 className="mb-2 text-4xl font-black">Create New Chatbot</h1>
          <PaymentBlock
            isBlocked={chatbotsCreated >= permission.maxChatbots}
            text={`You have reached max ${permission.maxChatbots} Chatbot limit`}
          >
            <UploadContent
              showGoBack
              onGoBack={closeDialog}
              showCreate
            ></UploadContent>
          </PaymentBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatbotModal;
