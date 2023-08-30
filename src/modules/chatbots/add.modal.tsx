"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import DocumentUploader from "@/modules/datasource/doc-uploader";
import TextSource from "@/modules/datasource/text-source";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDatasourceStore } from "@/lib/store/use-datasource-store";
import { MIN_TEXT_INPUT } from "@/modules/datasource/docs-constant";
import { useSupabaseAuth } from "@/lib/store/use-user";

const AddModal = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Step 1
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const { docs, text } = useDatasourceStore((state) => ({
    docs: state.docs,
    text: state.text,
  }));

  const { user, supabase } = useSupabaseAuth();

  const canCreate = loading || (!docs?.length && text?.length > MIN_TEXT_INPUT);

  const [error, setError] = useState("");

  const uploadFiles = async () => {
    if (!docs.length) return;

    const uploadPromises = docs.map(async (eachFile) => {
      const fileName = `/${user?.id}/${eachFile.name}`;
      const {
        data: { path },
      } = await supabase.storage.from("chatbots").upload(fileName, eachFile, {
        cacheControl: "3600",
        upsert: true,
      });
      return path;
    });

    try {
      return Promise.all(uploadPromises);
    } catch (e) {
      setError(
        "File upload error, please check the file format or contact the support",
      );
      console.error(e);
    }
  };

  const createChatbot = async () => {
    if (!canCreate) return;
    setLoading(true);

    try {
      const fileNames = await uploadFiles();

      const res = await axios.post("/app/chatbots/create", {
        files: fileNames,
      });

      const { chatbot } = res.data;

      if (!chatbot) throw new Error("Chatbot not found");

      push(`/chatbots/${chatbot.id}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const closeDialog = (state) => {
    if (!loading) setIsDialogOpen(state);
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
        Create a new site
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        overlayClass="backdrop-blur-3xl bg-white\/90 bg-center bg-no-repeat bg-contain"
        className="overflow-visible md:max-w-4xl"
        overlayStyle={
          {
            // backgroundImage: "url(/blobanimation.svg)",
          }
        }
      >
        <>
          <div className="w-full m-auto">
            <h1 className="mb-2 text-4xl font-black">Create New Chatbot</h1>
            <form onSubmit={createChatbot}>
              <ScrollArea className="h-[40vh] mt-4">
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                  <TextSource />
                  <DocumentUploader />
                </div>
              </ScrollArea>

              <div className="flex justify-center gap-1 mt-2">
                <Button
                  className="text-gray-800"
                  onClick={() => setIsDialogOpen(false)}
                  size={"lg"}
                  type="button"
                  loading={loading}
                  disabled={loading}
                  variant="ghost"
                >
                  Go back
                </Button>
                <Button
                  className="text-white "
                  type="submit"
                  size={"lg"}
                  loading={loading}
                  disabled={canCreate}
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
