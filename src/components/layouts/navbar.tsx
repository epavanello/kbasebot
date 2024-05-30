"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icons";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { UserAccountNav } from "@/components/layouts/user-account-nav";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DarkModeSwitch } from "@/components/ui/dark-mode-switch";
import Logo from "@/components/landing/logo";
import ChatbotSwitcher from "./chatbot-switcher";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

interface MainNavProps {
  items?: NavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex flex-1 items-center gap-2 px-2 md:gap-4">
          <button className="flex items-center space-x-2 md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <Icon icon={"majesticons:close"} /> : <Icon icon={"ep:menu"} />}
            <span className="sr-only">Menu</span>
          </button>
          <Logo href="/app" className="hidden sm:block" />
          <Logo href="/app" withText={false} width={35} height={35} className="block sm:hidden" />
          {pathname !== "/app" && <ChatbotSwitcher className="w-52" />}
          {items?.length ? (
            <nav className="hidden flex-1 justify-center gap-6 md:flex">
              {items?.map(({ href, disabled, icon, title, ...itemProps }, index) => {
                return (
                  <Link
                    key={index}
                    href={disabled ? "#" : href}
                    className={cn(buttonVariants({ variant: "ghost" }), !!disabled && "cursor-not-allowed opacity-60")}
                    {...itemProps}
                  >
                    {icon && <Icon className="mr-1 text-xl" icon={icon} />}
                    {title}
                  </Link>
                );
              })}
            </nav>
          ) : null}
          {showMobileMenu && items && <MobileNav items={items}>{children}</MobileNav>}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <DarkModeSwitch className="hidden sm:flex" />
          <UserAccountNav />
        </div>
      </div>
    </div>
  );
}
