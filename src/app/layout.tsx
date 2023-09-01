import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KBaseBot",
  description: "Generate chatbot with ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn("h-full", inter.className)}>
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </Providers>
      </body>
    </html>
  );
}
