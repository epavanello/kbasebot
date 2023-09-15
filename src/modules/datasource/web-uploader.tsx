import React, { useState } from "react";
import { IUrl, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { useSupabaseAuth } from "@/lib/store/use-user";
import ContentList from "./content-list";

const WebUploader = ({ chatbotId }: { chatbotId: string }) => {
  const { urls, appendUrls, deleteUrl, deleteAllUrls } = useDatasourceStore(
    (state) => ({
      urls: state.urls,
      appendUrls: state.appendUrls,
      deleteUrl: state.deleteUrl,
      deleteAllUrls: state.deleteAllUrls,
    }),
  );

  const { supabase } = useSupabaseAuth();

  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState("");

  const handleDeleteUrl = async (url: IUrl) => {
    if (url.trained) {
      await supabase
        .from("chatbot_urls")
        .delete()
        .eq("url", url)
        .eq("chatbot_id", chatbotId)
        .throwOnError();
    }
    deleteUrl(url.url);
  };

  const handleDeleteAllUrls = async () => {
    await supabase
      .from("chatbot_urls")
      .delete()
      .eq("chatbot_id", chatbotId)
      .throwOnError();
    deleteAllUrls();
  };

  const addLink = async (type: "sitemap" | "crawl" | "url") => {
    setLoading(true);
    try {
      const res = await axios.post<IUrl[]>(
        "/api/chatbots/datasource/load-urls",
        { [type]: url },
      );

      if (res.data?.length) {
        appendUrls(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Tabs defaultValue="fromUrl" className="w-full">
        <TabsList>
          <TabsTrigger value="fromUrl">Scrape Website</TabsTrigger>
          <TabsTrigger value="singleUrl">Single url</TabsTrigger>
          <TabsTrigger value="fromSitemap">Load from Sitemap</TabsTrigger>
        </TabsList>
        <TabsContent value="fromUrl">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="Url"
            />
            <Button
              disabled={loading}
              loading={loading}
              className="w-64"
              onClick={() => addLink("crawl")}
            >
              Get all links
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="singleUrl">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="Url"
            />
            <Button
              disabled={loading}
              loading={loading}
              className="w-64"
              onClick={() => addLink("url")}
            >
              Load single url
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="fromSitemap">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="Sitemap Url"
            />
            <Button
              disabled={loading}
              loading={loading}
              className="w-64"
              onClick={() => addLink("sitemap")}
            >
              Load from sitemap
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <ContentList
        title="Loaded Urls"
        items={urls.map((url) => ({
          value: url.url,
          chars: url.chars,
          id: url.url,
          uploaded: url.trained,
          data: url,
        }))}
        onDelete={(url) => handleDeleteUrl(url.data!)}
        onDeleteAll={() => handleDeleteAllUrls()}
      />
    </div>
  );
};

export default WebUploader;
