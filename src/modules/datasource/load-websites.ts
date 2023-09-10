import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import Sitemapper from "sitemapper";
import { Document } from "langchain/document";

export const loadWebsites = async (url) => {
  if (!url) return null;
  const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

  const loader = new RecursiveUrlLoader(url, {
    extractor: compiledConvert,
    maxDepth: 1,
    // excludeDirs: ["https://js.langchain.com/docs/api/"],
  });

  return loader.load();
};

export const loadSingleUrl = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url, {
    timeout: 60000,
  });
  return loader.loadAndSplit();
};

export const loadMultiUrl = async (urls: { url: string }[]) => {
  return (await Promise.all(urls.map((i) => loadSingleUrl(i.url)))).flat();
};

export const loadSiteMap = async (sitemapUrl: string) => {
  const Site = new Sitemapper({
    url: sitemapUrl,
    timeout: 10000, // 5 seconds
  });

  try {
    const sites = await Site.fetch();

    return sites;
  } catch (error) {
    console.log(error);
  }
};
