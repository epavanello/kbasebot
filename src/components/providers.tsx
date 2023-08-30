"use client";

import React, { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseAuthProvider } from "@/lib/store/use-user";
import NextNProgress from "nextjs-progressbar";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SupabaseAuthProvider>
        {children}
        <Toaster />
      </SupabaseAuthProvider>
      <NextNProgress />
    </ThemeProvider>
  );
};

export default Providers;
