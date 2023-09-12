"use client";

import React from "react";
import NavLinks from "./nav-links";
import NavSheet from "./nav-sheet";
import Logo from "@/components/landing/logo";
import { usePathname } from "next/navigation";

export default function LandingNav() {
  // hide nav if not on landing page
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 bg-background/80 backdrop-blur-md border-b`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
        aria-label="Global"
      >
        <div className="flex w-full items-center gap-x-12 z-50">
          <Logo />
          <div className="hidden flex-1 lg:flex lg:gap-x-12">
            <NavLinks
              links={
                isLanding
                  ? [
                      {
                        href: "/#features",
                        label: "Features",
                      },
                      {
                        href: "/#pricing",
                        label: "Pricing",
                      },
                    ]
                  : []
              }
            />
          </div>
        </div>
        <div className="flex lg:hidden z-50">
          <NavSheet />
        </div>
        <div className="hidden lg:flex space-x-1 z-50"></div>
      </nav>
    </header>
  );
}
