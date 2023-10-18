import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import Sitemapper from "sitemapper";

export const loadWebsites = async (url: string) => {
  if (!url) {
    return null;
  }
  const compiledConvert = compile({});

  const loader = new RecursiveUrlLoader(url, {
    extractor: compiledConvert,
    maxDepth: 3,
  });

  return loader.load();
};

// TODO: use ToMarkdownLoader to get better content
export const loadSingleUrl = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url, {
    timeout: 60000,
  });
  return loader.load();
};

export const loadMultiUrl = async (url: string[]) => {
  return (await Promise.all(url.map((url) => loadSingleUrl(url)))).flat();
};

export const loadSiteMap = async (sitemapUrl: string) => {
  const Site = new Sitemapper({
    url: sitemapUrl,
    timeout: 10000, // 5 seconds,
  });

  return await Site.fetch();
};
