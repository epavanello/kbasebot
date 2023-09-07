import React from "react";
import NavLinks from "./nav-links";
import NavSheet from "./nav-sheet";
import Logo from "@/components/landing/logo";

export default function LandingNav() {
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
            <NavLinks />
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
