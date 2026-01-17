import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";
import Analytics from "@/components/analytics";
import { NEXT_PUBLIC_URL } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_URL),
  title: "KBaseBot",
  twitter: {
    site: "@kbasebot",
    creator: "@kbasebot",
    title: "KBaseBot",
  },
  openGraph: {
    type: "website",
    title: "KBaseBot",
  },
  description:
    "Turn PDFs, Docx, Notion & websites into dynamic chatbots. Embed on your platform, making static content interactive. Elevate your content into real-time dialogues. Knowledge has never been this alive or accessible.",
  keywords: "chatbot, knowledge base, customer support, no-code, pdf, docx, notion, gpt-5, gpt-5-mini",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <Analytics />
      <body className={cn("h-full", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
