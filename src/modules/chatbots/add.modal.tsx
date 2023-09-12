"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, truncate } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import DocumentUploader from "@/modules/datasource/doc-uploader";
import TextSource from "@/modules/datasource/text-source";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFile, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { MIN_TEXT_INPUT } from "@/modules/datasource/docs-constant";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { Icon } from "@/components/ui/icons";
import WebUploader from "@/modules/datasource/web-uploader";
import PaymentBlock from "@/components/ui/payment-block";
import { toast } from "@/components/ui/use-toast";

const AddModal = ({ chatbotsCreated }: { chatbotsCreated: number }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Step 1
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const {
    docs,
    text,
    urls = [],
  } = useDatasourceStore((state) => ({
    docs: state.docs,
    text: state.text,
    urls: state.urls,
  }));

  const { user, supabase, permission } = useSupabaseAuth();

  const totalUrlChars = urls?.length
    ? urls.reduce((acc, next) => acc + (next.chars || 0), 0)
    : 0;

  const canCreate =
    !loading &&
    (!!docs?.length ||
      !!urls?.length ||
      text?.length > MIN_TEXT_INPUT ||
      totalUrlChars > 0);

  const [error, setError] = useState("");

  const uploadFile = async (file: File): Promise<IFile> => {
    const fileName = `/${user?.id}/${file.name}`;
    const res =
      (await supabase.storage.from("chatbots").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })) || {};

    if (res.error) {
      throw new Error(res.error.message);
    }

    console.log(res);
    const path = res.data.path;

    if (!path) throw new Error("File upload error");

    return { file, path, uploaded: true };
  };

  const createChatbot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canCreate) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/chatbots/create");
      const { chatbot } = res.data;

      if (!chatbot) {
        throw new Error("Chatbot not found");
      }

      if (docs && docs.length > 0) {
        for (let doc of docs) {
          if (!doc.uploaded) {
            const newDoc = await uploadFile(doc.file);
            const res = await axios.post(
              `/api/chatbots/upload?chatbot_id=${encodeURIComponent(
                chatbot.id,
              )}`,
              {
                file: newDoc.path,
              },
            );
            if (res.status === 200) {
              useDatasourceStore.getState().setDocUploaded(newDoc);
            }
          }
        }
      }

      if (urls && urls.length > 0) {
        for (let url of urls) {
          if (!url.uploaded) {
            const res = await axios.post(
              `/api/chatbots/upload?chatbot_id=${encodeURIComponent(
                chatbot.id,
              )}`,
              {
                url: url.url,
              },
            );
            if (res.status === 200) {
              useDatasourceStore.getState().setUrlUploaded(url);
            }
          }
        }
      }

      if (text && text.length > 0) {
        const res = await axios.post(`/api/chatbots/${chatbot.id}/upload`, {
          text,
        });
      }

      push(`/app/chatbots/${chatbot.id}`);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "There was a problem with your request. please try again",
      });
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
            <form onSubmit={createChatbot}>
              <ScrollArea className="h-[40vh] mt-4">
                <Tabs
                  orientation={"vertical"}
                  defaultValue="text"
                  className="flex w-full"
                >
                  <TabsList className="flex flex-col py-4 h-full gap-2 items-start">
                    {[
                      {
                        label: "Text",
                        value: "text",
                        icon: "fluent:textbox-16-regular",
                        desc: `${text.length} Chars`,
                      },
                      {
                        label: "Files",
                        value: "files",
                        icon: "material-symbols:file-copy-outline",
                        desc: `${docs.length} Files`,
                      },
                      {
                        label: "Websites",
                        value: "websites",
                        icon: "fluent-mdl2:website",
                        desc: `${truncate(totalUrlChars.toString(), 24)} Chars`,
                      },
                    ].map((item) => (
                      <TabsTrigger
                        className="w-full justify-start items-start text-sm"
                        key={item.value}
                        value={item.value}
                      >
                        <Icon icon={item.icon} className="mr-1 mt-1" />
                        <div className="flex flex-col items-start">
                          <span>{item.label}</span>
                          <small className="text-[10px]">{item.desc}</small>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {[
                    { Comp: TextSource, value: "text" },
                    { Comp: DocumentUploader, value: "files" },
                    { Comp: WebUploader, value: "websites" },
                  ].map((item) => (
                    <TabsContent
                      key={item.value}
                      className="flex-1 p-4 border-secondary border mt-0 ml-2"
                      value={item.value}
                    >
                      <item.Comp />
                    </TabsContent>
                  ))}
                </Tabs>
              </ScrollArea>

              <div className="flex justify-center gap-1 mt-2">
                <Button
                  className="text-gray-800"
                  onClick={() => setIsDialogOpen(false)}
                  size={"lg"}
                  type="button"
                  disabled={loading}
                  variant="ghost"
                >
                  Go back
                </Button>
                <Button
                  className="text-white"
                  type="submit"
                  size={"lg"}
                  loading={loading}
                  disabled={!canCreate}
                >
                  Create
                </Button>
              </div>
            </form>
          </PaymentBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
