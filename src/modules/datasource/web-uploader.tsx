import React, { useState } from "react";
import { IUrl, useDatasourceStore } from "@/lib/store/use-datasource-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";

const WebUploader = () => {
  const { urls, setUrls, deleteUrl, deleteAllUrls } = useDatasourceStore(
    (state) => ({
      urls: state.urls,
      setUrls: state.setUrls,
      deleteUrl: state.deleteUrl,
      deleteAllUrls: state.deleteAllUrls,
    }),
  );

  const [loading, setLoading] = useState(false);

  const [urlToFetch, setUrlToFetch] = useState("");
  const [sitemap, setSitemap] = useState("");

  const getAllLinks = async (isSitemap?: boolean) => {
    setLoading(true);
    try {
      const res = await axios.post<IUrl[]>(
        "/api/chatbots/datasource/load-urls",
        isSitemap ? { sitemap } : { url: urlToFetch },
      );

      if (res.data?.length) {
        setUrls(res.data);
      }

      console.log({ res });
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
          <TabsTrigger value="fromSitemap">Load from Sitemap</TabsTrigger>
        </TabsList>
        <TabsContent value="fromUrl">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              onChange={(e) => setUrlToFetch(e.target.value)}
              type="url"
              placeholder="Url"
            />
            <Button
              disabled={loading}
              loading={loading}
              className="w-64"
              onClick={() => getAllLinks(false)}
            >
              Get all links
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="fromSitemap">
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              onChange={(e) => setSitemap(e.target.value)}
              type="url"
              placeholder="Sitemap Url"
            />
            <Button
              disabled={loading}
              loading={loading}
              className="w-64"
              onClick={() => getAllLinks(true)}
            >
              Load from sitemap
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {!!urls?.length && (
        <div className="w-full bg-secondary p-4 border border-dashed">
          <div className="flex justify-between gap-4">
            <h1 className="text-center font-bold my-1">Loaded Urls</h1>
            <Button
              onClick={() => deleteAllUrls()}
              variant="destructive"
              size={"sm"}
              className="text-xs h-auto bg-none"
            >
              <Icon className={"text-md mr-1"} icon={"ph:trash"} /> Delete All
            </Button>
          </div>

          <ul className="flex flex-col gap-2 h-92 overflow-y-scroll p-2">
            {urls.map((url) => (
              <li key={url.url} className="flex">
                <div className="relative flex-1">
                  <Input
                    className="text-sm h-8 pr-10"
                    value={url.url}
                    placeholder="url"
                    readOnly
                  />
                  <small className="opacity-50 text-[10px] absolute right-0 bottom-0 px-1 py-1 bg-secondary/50 rounded-lg">
                    {url.chars}
                  </small>
                </div>

                <Button
                  onClick={() => deleteUrl(url.url)}
                  variant="icon"
                  size={"sm"}
                  className="text-red-500"
                >
                  <Icon icon={"ph:trash"} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebUploader;
