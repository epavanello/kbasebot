"use client";

import React, { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseAuthProvider } from "@/lib/store/use-user";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import StyledJsxRegistry from "@/components/registry";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledJsxRegistry>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <SupabaseAuthProvider>
            {children}
            <Toaster />
          </SupabaseAuthProvider>
          <ProgressBar
            options={{
              showSpinner: false,
            }}
            color="#006694"
          />
        </TooltipProvider>
      </ThemeProvider>
    </StyledJsxRegistry>
  );
};

export default Providers;
