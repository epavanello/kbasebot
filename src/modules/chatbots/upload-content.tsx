"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import DocumentUploader from "@/modules/datasource/doc-uploader";
import TextSource from "@/modules/datasource/text-source";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IFile,
  INotion,
  IUrl,
  useDatasourceStore,
} from "@/lib/store/use-datasource-store";
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
  }));

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

  // loading text, urls, notions and files
  useEffect(() => {
    if (chatbot && !showCreate) {
      setLoading(true);

      setText({ content: chatbot.text || "", changed: false });
      Promise.all([
        supabase
          .from("chatbot_urls")
          .select("*, knowledge_base(id)")
          .then(({ data, error }) => {
            if (error) {
              console.error(error);
              return;
            }
            setUrls(
              data.map(
                (item) =>
                  ({
                    url: item.url,
                    chars: item.chars,
                    trained: item.knowledge_base.length > 0,
                  }) as IUrl,
              ),
            );
          }),
        supabase
          .from("chatbot_docs")
          .select("*, knowledge_base(id)")
          .eq("chatbot_id", chatbot.id)
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
                    name: item.file_name.split("/").pop() || "",
                    chars: item.chars,
                    trained: item.knowledge_base.length > 0,
                  }) as IFile,
              ),
            );
          }),
        // Get notion from chatbot_notion
        supabase
          .from("chatbot_notion")
          .select("*, knowledge_base(id)")
          .eq("chatbot_id", chatbot.id)
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
                    trained: item.knowledge_base.length > 0,
                  }) as INotion,
              ),
            );
          }),
      ]).finally(() => setLoading(false));
    }
  }, [chatbot, showCreate]);

  const totalDocChars = docs.reduce((acc, next) => acc + (next.chars || 0), 0);

  const totalUrlChars = urls.reduce((acc, next) => acc + (next.chars || 0), 0);

  const totalNotionChars = notion.reduce(
    (acc, next) => acc + (next.chars || 0),
    0,
  );

  const canTrain =
    !loading &&
    (docs.filter((doc) => !doc.trained).length > 0 ||
      urls.filter((url) => !url.trained).length > 0 ||
      notion.filter((n) => !n.trained).length > 0 ||
      (text.changed &&
        text.content.length >= MIN_TEXT_INPUT &&
        text.content.length < MAX_TEXT_INPUT));

  const uploadContent = async (c: Chatbot) => {
    if (!c) throw new Error("Chatbot not found");
    const uploadPath = `/api/chatbots/train?chatbot_id=${encodeURIComponent(
      c.id,
    )}`;
    const promises: Promise<void>[] = [];
    for (let doc of docs) {
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

    for (let url of urls) {
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

    for (let n of notion) {
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
      if (!chatbot) {
        throw new Error("Chatbot not found");
      }
      setLoading(true);
      e.preventDefault();
      await uploadContent(chatbot);

      resetDatasource();
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
                desc: `${totalDocChars} chars`,
              },
              {
                label: "Websites",
                value: "websites",
                icon: "fluent-mdl2:website",
                desc: `${totalUrlChars} chars`,
              },
              {
                label: "Notion",
                value: "notion",
                icon: "logos:notion-icon",
                desc: `${totalNotionChars} chars`,
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
            disabled={!canTrain}
          >
            Create
          </Button>
        ) : (
          <Button
            className="text-white"
            type="submit"
            size={"lg"}
            loading={loading}
            disabled={!canTrain}
          >
            Train
          </Button>
        )}
      </div>
    </form>
  );
}
