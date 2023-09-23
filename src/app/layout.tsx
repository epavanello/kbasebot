import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import Head from "next/head";
import Analytics from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KBaseBot",
  description:
    "Turn PDFs, Docx, Notion & websites into dynamic chatbots. Embed on your platform, making static content interactive. Elevate your content into real-time dialogues. Knowledge has never been this alive or accessible.",
  keywords:
    "chatbot, knowledge base, customer support, no-code, pdf, docx, notion, gpt-4, gpt-3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <meta property="og:image:alt" content="KBaseBot" />
        <meta property="twitter:image:alt" content="KBaseBot" />
        <meta property="og:title" content="KBaseBot" />
        <meta property="twitter:title" content="KBaseBot" />
      </head>
      <Analytics />
      <body className={cn("h-full", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
