import { NEXT_PUBLIC_URL } from "../env";

export const configuration = {
  site: {
    name: "KBaseBot",
    description: "Turn documents into knowledge",
    siteUrl: NEXT_PUBLIC_URL,
    siteName: "KBaseBot",
    language: "en",
    logo: "/logo.png",
  },
  landingUrls: ["/", "/blog", "/pricing", "/faqs", "/privacy"],
};
