"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import DocumentUploader from "@/modules/datasource/doc-uploader";
import TextSource from "@/modules/datasource/text-source";
import { IFile, INotion, IUrl, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { MAX_TEXT_INPUT, MIN_TEXT_INPUT } from "@/modules/datasource/docs-constant";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { Icon, LoadingIcon } from "@/components/ui/icons";
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
  const [formLoading, setFormLoading] = useState(false);
  const { push } = useRouter();
  const { supabase } = useSupabaseAuth();

  // chatbot as ref
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);

  const {
    docs,
    text,
    urls,
    notion,
    setDocs,
    setText,
    setUrls,
    setDocTrained,
    setNotion,
    setNotionTrained,
    setUrlTrained,
    resetDatasource,
    startLoading,
  } = useDatasourceStore((state) => ({
    docs: state.docs,
    text: state.text,
    urls: state.urls,
    notion: state.notion,
    setDocs: state.setDocs,
    setText: state.setText,
    setUrls: state.setUrls,
    setNotion: state.setNotion,
    setDocTrained: state.setDocTrained,
    setUrlTrained: state.setUrlTrained,
    setNotionTrained: state.setNotionTrained,
    resetDatasource: state.reset,
    startLoading: state.startLoading,
  }));

  useEffect(() => {
    if (externalChatbotId) {
      if (showCreate) {
        resetDatasource();
      } else {
        startLoading();
      }

      setLoading(true);

      Promise.all([
        supabase
          .from("chatbots")
          .select("*")
          .eq("id", externalChatbotId)
          .then(({ data, error }) => {
            if (error) {
              console.error(error);
            } else {
              setChatbot(data[0]);
              setText({ content: data[0].text || "", changed: false });
            }
          }),
        ...(!showCreate
          ? [
              supabase
                .from("chatbot_urls_status")
                .select("*")
                .eq("chatbot_id", externalChatbotId)
                .then(({ data, error }) => {
                  if (error) {
                    console.error(error);
                    return;
                  }
                  setUrls(
                    data.map(
                      (item) =>
                        ({
                          id: item.id,
                          url: item.url,
                          chars: item.chars,
                          trained: item.trained,
                        }) as IUrl,
                    ),
                  );
                }),
              supabase
                .from("chatbot_docs_status")
                .select("*")
                .eq("chatbot_id", externalChatbotId)
                .then(({ data, error }) => {
                  if (error) {
                    console.error(error);
                    return;
                  }
                  setDocs(
                    data.map(
                      (item) =>
                        ({
                          id: item.id,
                          name: (item.file_name || "").split("/").pop() || "",
                          chars: item.chars,
                          trained: item.trained,
                        }) as IFile,
                    ),
                  );
                }),
              supabase
                .from("chatbot_notion_status")
                .select("*")
                .eq("chatbot_id", externalChatbotId)
                .then(({ data, error }) => {
                  if (error) {
                    console.error(error);
                    return;
                  }
                  setNotion(
                    data.map(
                      (item) =>
                        ({
                          id: item.id,
                          name: item.name,
                          chars: item.chars,
                          trained: item.trained,
                        }) as INotion,
                    ),
                  );
                }),
            ]
          : []),
      ])
        .catch((e) => {
          console.error(e);
          toast({
            variant: "destructive",
            title: "Something went wrong!",
            description: "There was a problem with your request. please try again",
          });
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalChatbotId, supabase]);

  const totalDocChars = docs?.reduce((acc, next) => acc + (next.chars || 0), 0) || 0;

  const totalUrlChars = urls?.reduce((acc, next) => acc + (next.chars || 0), 0) || 0;

  const totalNotionChars = notion?.reduce((acc, next) => acc + (next.chars || 0), 0) || 0;

  const canTrain =
    !loading &&
    !formLoading &&
    ((docs && docs.filter((doc) => !doc.trained).length > 0) ||
      (urls && urls.filter((url) => !url.trained).length > 0) ||
      (notion && notion.filter((n) => !n.trained).length > 0) ||
      (text && text.changed && text.content.length >= MIN_TEXT_INPUT && text.content.length < MAX_TEXT_INPUT));

  const uploadContent = async (c: Chatbot) => {
    if (!c) throw new Error("Chatbot not found");
    const uploadPath = `/api/chatbots/train?chatbot_id=${encodeURIComponent(c.id)}`;
    const promises: Promise<void>[] = [];
    for (let doc of docs || []) {
      if (!doc.trained) {
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const res = await axios.post(uploadPath, {
                file: doc.id,
              });
              if (res.status === 200) {
                setDocTrained(doc);
              } else {
                reject(new Error("Training failed"));
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          }),
        );
      }
    }

    for (let url of urls || []) {
      if (!url.trained) {
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const res = await axios.post(uploadPath, {
                url: url.url,
              });
              if (res.status === 200) {
                setUrlTrained(url);
              } else {
                reject(new Error("Training failed"));
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          }),
        );
      }
    }

    for (let n of notion || []) {
      if (!n.trained) {
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const res = await axios.post(uploadPath, {
                notion: n.id,
              });
              if (res.status === 200) {
                setNotionTrained(n);
              } else {
                reject(new Error("Training failed"));
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          }),
        );
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
              useDatasourceStore.getState().setText({ content: text.content, changed: false });
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
      if (!chatbot) {
        throw new Error("Chatbot not found");
      }
      setFormLoading(true);
      e.preventDefault();
      await uploadContent(chatbot);

      if (showCreate) {
        push(`/app/chatbots/${chatbot.id}`);
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "There was a problem with your request. please try again",
      });
    }
    setFormLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex-1">
      <Tabs defaultValue="text" className="flex flex-col md:flex-row">
        <TabsList className="flex h-full flex-col items-stretch gap-2 overflow-auto sm:flex-row md:flex-col">
          {[
            {
              label: "Text",
              value: "text",
              icon: "fluent:textbox-16-regular",
              desc: `${text?.content.length || 0} chars`,
            },
            {
              label: "Files",
              count: docs?.length,
              value: "files",
              icon: "material-symbols:file-copy-outline",
              desc: `${totalDocChars} chars`,
            },
            {
              label: "Websites",
              count: urls?.length,
              value: "websites",
              icon: "fluent-mdl2:website",
              desc: `${totalUrlChars} chars`,
            },
            {
              label: "Notion",
              count: notion?.length,
              value: "notion",
              icon: "logos:notion-icon",
              desc: `${totalNotionChars} chars`,
            },
          ].map((item) => (
            <TabsTrigger
              className="flex-1 shrink-0 items-start justify-center text-sm"
              key={item.value}
              value={item.value}
            >
              <Icon icon={item.icon} className="mr-1.5 mt-0.5" />
              <div className="flex flex-col items-start">
                <span className="flex flex-row items-center gap-2">
                  {"count" in item ? (
                    <>
                      {item.label}
                      {typeof item.count === "number" ? ` (${item.count})` : <LoadingIcon className="text-sm" />}
                    </>
                  ) : (
                    item.label
                  )}
                </span>
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
          <TabsContent key={item.value} className="ml-2 mt-0 flex-1 border border-secondary p-4" value={item.value}>
            <item.Comp {...item.props} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="my-2 flex justify-center gap-1">
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
          <Button className="text-white" type="submit" size={"lg"} loading={formLoading} disabled={!canTrain}>
            Create Chatbot
          </Button>
        ) : (
          <Button className="text-white" type="submit" size={"lg"} loading={formLoading} disabled={!canTrain}>
            Train
          </Button>
        )}
      </div>
    </form>
  );
}
