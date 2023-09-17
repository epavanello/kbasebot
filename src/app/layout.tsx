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
    "KBaseBot is a no-code chatbot for knowledge base and customer support, trainable with PDF, DOCX, Notion, and more.",
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
      <Analytics />
      <body className={cn("h-full", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
