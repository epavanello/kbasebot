"use client";

import React, { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserContextProvider } from "@/lib/store/use-user";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <UserContextProvider>
        {children}
        <Toaster />
      </UserContextProvider>
    </ThemeProvider>
  );
};

export default Providers;
