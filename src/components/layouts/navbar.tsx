"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icons";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { UserAccountNav } from "@/components/layouts/user-account-nav";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { DarkModeSwitch } from "@/components/ui/dark-mode-switch";

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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="px-2 flex flex-1 gap-6 md:gap-10">
          <Link
            href="/app"
            className="hidden items-center space-x-2 md:flex mb-1"
          >
            <Logo />
          </Link>
          {items?.length ? (
            <nav className="hidden gap-6 md:flex flex-1 justify-center">
              {items?.map(
                ({ href, disabled, icon, title, ...itemProps }, index) => {
                  return (
                    <Link
                      key={index}
                      href={disabled ? "#" : href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        !!disabled && "cursor-not-allowed opacity-60",
                      )}
                      {...itemProps}
                    >
                      {icon && <Icon className="text-xl mr-1" icon={icon} />}
                      {title}
                    </Link>
                  );
                },
              )}
            </nav>
          ) : null}
          <button
            className="flex items-center space-x-2 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <Icon icon={"majesticons:close"} />
            ) : (
              <Icon icon={"ep:menu"} />
            )}
            <span className="font-bold">Menu</span>
          </button>
          {showMobileMenu && items && (
            <MobileNav items={items}>{children}</MobileNav>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <DarkModeSwitch />
          <UserAccountNav />
        </div>
      </div>
    </div>
  );
}
