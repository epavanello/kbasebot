import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import Sitemapper from "sitemapper";
import { Document } from "langchain/document";

export const loadWebsites = async (url: string) => {
  if (!url) {
    return null;
  }
  const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

  const loader = new RecursiveUrlLoader(url, {
    extractor: compiledConvert,
    maxDepth: 1,
    // excludeDirs: ["https://js.langchain.com/docs/api/"],
  });

  return loader.load();
};

// TODO: use ToMarkdownLoader to get better content
export const loadSingleUrl = async (url: string, split = false) => {
  const loader = new CheerioWebBaseLoader(url, {
    timeout: 60000,
  });
  if (split) {
    return loader.loadAndSplit();
  } else {
    return loader.load();
  }
};

export const loadMultiUrl = async (url: string[], split = false) => {
  return (
    await Promise.all(url.map((url) => loadSingleUrl(url, split)))
  ).flat();
};

export const loadSiteMap = async (sitemapUrl: string) => {
  const Site = new Sitemapper({
    url: sitemapUrl,
    timeout: 10000, // 5 seconds
  });

  return await Site.fetch();
};
