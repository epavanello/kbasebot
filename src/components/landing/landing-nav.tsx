"use client";

import React from "react";
import NavLinks from "./nav-links";
import NavSheet from "./nav-sheet";
import Logo from "@/components/landing/logo";
import { usePathname } from "next/navigation";
import { configuration } from "@/lib/config/app.config";

const landingPages = configuration.landingUrls;

export default function LandingNav() {
  // hide nav if not on landing page
  const pathname = usePathname();

  const isLanding = landingPages.includes(pathname);

  return (
    <header className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-all duration-200`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8" aria-label="Global">
        <div className="z-50 flex w-full items-center gap-x-12">
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
                      {
                        href: "/blog",
                        label: "Blogs",
                      },
                      {
                        href: "/faqs",
                        label: "FAQs",
                      },
                    ]
                  : []
              }
            />
          </div>
        </div>
        <div className="z-50 flex lg:hidden">
          <NavSheet />
        </div>
        <div className="z-50 hidden space-x-1 lg:flex"></div>
      </nav>
    </header>
  );
}
