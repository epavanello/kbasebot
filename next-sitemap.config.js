const siteUrl = process.env.NEXT_PUBLIC_URL;

// add your private routes here
const exclude = ["/auth/*", "/**.png", "/app", "/app*"];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude,
  robotsTxtOptions: {
    additionalSitemaps: [[siteUrl, "server-sitemap.xml"].join("/")],
  },
};
