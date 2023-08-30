"use client";

import React, { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseAuthProvider } from "@/lib/store/use-user";
import NextNProgress from "nextjs-progressbar";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <SupabaseAuthProvider>
          {children}
          <Toaster />
        </SupabaseAuthProvider>
        <NextNProgress />
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
