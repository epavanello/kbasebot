import { getServerSideSitemap } from "next-sitemap";
import { allPosts } from "contentlayer/generated";
import { configuration } from "@/lib/config/app.config";

const siteUrl = configuration.site.siteUrl;

if (!siteUrl) {
  throw new Error(`Invalid "siteUrl", please fix in configuration.ts`);
}

export async function GET() {
  const posts = getPostsSitemap();

  return getServerSideSitemap(posts);
}

function getPostsSitemap() {
  return allPosts.map((post) => {
    return {
      loc: `${siteUrl}${post.url}`,
      lastmod: new Date().toISOString(),
    };
  });
}
