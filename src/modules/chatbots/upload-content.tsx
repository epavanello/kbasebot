"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import DocumentUploader from "@/modules/datasource/doc-uploader";
import TextSource from "@/modules/datasource/text-source";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFile, useDatasourceStore } from "@/lib/store/use-datasource-store";
import {
  MAX_TEXT_INPUT,
  MIN_TEXT_INPUT,
} from "@/modules/datasource/docs-constant";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { Icon } from "@/components/ui/icons";
import WebUploader from "@/modules/datasource/web-uploader";
import { toast } from "@/components/ui/use-toast";
import { Chatbot } from "@/lib/supabase";
import NotionUploader from "@/modules/datasource/notion-uploader";

export function UploadContent({
  showGoBack = false,
  onGoBack,
  showCreate = false,
  externalChatbotId = "",
}: {
  showGoBack?: boolean;
  onGoBack?: () => void;
  showCreate?: boolean;
  externalChatbotId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const { supabase } = useSupabaseAuth();

  //const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  // chatbot as ref
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);

  const { docs, text, urls, setDocs, setText, setUrls } = useDatasourceStore(
    (state) => ({
      docs: state.docs,
      text: state.text,
      urls: state.urls,
      setDocs: state.setDocs,
      setText: state.setText,
      appendUrls: state.appendUrls,
      setUrls: state.setUrls,
    }),
  );

  console.log({ docs, text, urls });

  useEffect(() => {
    if (externalChatbotId) {
      setLoading(true);
      supabase
        .from("chatbots")
        .select("*")
        .eq("id", externalChatbotId)
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            setChatbot(data[0]);
          }
          setLoading(false);
        });
    }
  }, [externalChatbotId]);

  // loading text, urls and files
  useEffect(() => {
    if (chatbot && !showCreate) {
      setLoading(true);

      setText({ content: chatbot.text || "", changed: false });
      Promise.all([
        supabase
          .from("chatbot_urls")
          .select("*")
          .then(({ data, error }) => {
            if (error) {
              console.error(error);
              return;
            }
            setUrls(
              data.map((item) => ({
                url: item.url,
                chars: item.chars,
                uploaded: true,
              })),
            );
          }),
        // Get files from file bucket
        supabase.storage
          .from("files")
          .list(`${chatbot.id}/`)
          .then(({ data, error }) => {
            if (error) {
              console.error(error);
              return;
            }
            setDocs(
              data.map((item) => ({
                file: new File([], item.name.split("/").pop() || ""),
                path: item.name,
                uploaded: true,
              })),
            );
          }),
      ]).finally(() => setLoading(false));
    }
  }, [chatbot, showCreate]);

  const totalUrlChars = urls?.length
    ? urls.reduce((acc, next) => acc + (next.chars || 0), 0)
    : 0;

  const canSend =
    !loading &&
    (docs.filter((doc) => !doc.uploaded).length > 0 ||
      urls.filter((url) => !url.uploaded).length > 0 ||
      (text.changed &&
        text.content.length >= MIN_TEXT_INPUT &&
        text.content.length < MAX_TEXT_INPUT));

  const createChatbot = async () => {
    if (!canSend) {
      throw new Error("Can't create chatbot");
    }

    const res = await axios.post("/api/chatbots/create");
    const data = res.data as { chatbot: Chatbot };

    if (!data.chatbot) {
      throw new Error("Chatbot not found");
    }

    setChatbot(data.chatbot);
    return data.chatbot;
  };

  const uploadFile = async (file: File, c: Chatbot): Promise<IFile> => {
    if (!c) {
      throw new Error("Chatbot not found");
    }
    const fileName = `/${c.id}/${file.name}`;
    const { data, error } =
      (await supabase.storage.from("files").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })) || {};

    if (error) {
      throw new Error(error.message);
    }

    const path = data.path;

    if (!path) throw new Error("File upload error");

    return { file, path, uploaded: true };
  };

  const uploadContent = async (c: Chatbot) => {
    if (!c) throw new Error("Chatbot not found");
    const uploadPath = `/api/chatbots/upload?chatbot_id=${encodeURIComponent(
      c.id,
    )}`;
    const promises: Promise<void>[] = [];
    if (docs && docs.length > 0) {
      for (let doc of docs) {
        if (!doc.uploaded && doc.file.size > 0) {
          promises.push(
            new Promise(async (resolve, reject) => {
              try {
                const newDoc = await uploadFile(doc.file, c);
                const res = await axios.post(uploadPath, {
                  file: newDoc.path,
                });
                if (res.status === 200) {
                  useDatasourceStore.getState().setDocUploaded(newDoc);
                } else {
                  reject(new Error("Upload failed"));
                }
                resolve();
              } catch (e) {
                reject(e);
              }
            }),
          );
        }
      }
    }

    if (urls && urls.length > 0) {
      for (let url of urls) {
        if (!url.uploaded) {
          promises.push(
            new Promise(async (resolve, reject) => {
              try {
                const res = await axios.post(uploadPath, {
                  url: url.url,
                });
                if (res.status === 200) {
                  useDatasourceStore.getState().setUrlUploaded(url);
                } else {
                  reject(new Error("Upload failed"));
                }
                resolve();
              } catch (e) {
                reject(e);
              }
            }),
          );
        }
      }
    }

    if (
      text &&
      text.content.length > 0 &&
      text.content.length >= MIN_TEXT_INPUT &&
      text.content.length < MAX_TEXT_INPUT
    ) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const res = await axios.post(uploadPath, {
              text: text.content,
            });
            if (res.status === 200) {
              useDatasourceStore
                .getState()
                .setText({ content: text.content, changed: false });
            } else {
              reject(new Error("Upload failed"));
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        }),
      );
    }

    await Promise.all(promises);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      let c = chatbot;
      if (showCreate) {
        c = await createChatbot();
      }
      await uploadContent(c!);
      if (showCreate) {
        push(`/app/chatbots/${c!.id}`);
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "There was a problem with your request. please try again",
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex-1 overflow-auto">
      <ScrollArea className="mt-4">
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
                desc: `${text.content.length} Chars`,
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
                desc: `${totalUrlChars / 1000} kb`,
              },
              {
                label: "Notion",
                value: "notion",
                icon: "logos:notion-icon",
                desc: `${totalUrlChars / 1000} kb`,
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
            {
              Comp: TextSource,
              value: "text",
              props: { chatbotId: chatbot?.id || "" },
            },
            {
              Comp: DocumentUploader,
              value: "files",
              props: { chatbotId: chatbot?.id || "" },
            },
            {
              Comp: WebUploader,
              value: "websites",
              props: { chatbotId: chatbot?.id || "" },
            },
            {
              Comp: NotionUploader,
              value: "notion",
              props: { chatbotId: chatbot?.id || "" },
            },
          ].map((item) => (
            <TabsContent
              key={item.value}
              className="flex-1 p-4 border-secondary border mt-0 ml-2"
              value={item.value}
            >
              <item.Comp {...item.props} />
            </TabsContent>
          ))}
        </Tabs>
      </ScrollArea>

      <div className="flex justify-center gap-1 my-2">
        {showGoBack && (
          <Button
            className="text-gray-800"
            onClick={() => onGoBack?.()}
            size={"lg"}
            type="button"
            disabled={loading}
            variant="ghost"
          >
            Go back
          </Button>
        )}
        {showCreate ? (
          <Button
            className="text-white"
            type="submit"
            size={"lg"}
            loading={loading}
            disabled={!canSend}
          >
            Create
          </Button>
        ) : (
          <Button
            className="text-white"
            type="submit"
            size={"lg"}
            loading={loading}
            disabled={!canSend}
          >
            Upload
          </Button>
        )}
      </div>
    </form>
  );
}
