"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { DarkModeSwitch } from "../ui/dark-mode-switch";

export default function NavLinks({
  isCol = false,
  links = [],
}: {
  isCol?: boolean;
  links?: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  const { user } = useSupabaseAuth();

  return (
    <div
      className={cn("text-md flex flex-1 items-center justify-end", {
        "flex-col space-y-6": isCol,
        "space-x-6": !isCol,
      })}
    >
      <div
        className={cn("flex flex-1 justify-center", {
          "flex-col items-center space-y-6 text-2xl": isCol,
          "space-x-6": !isCol,
        })}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "text-sm transition-colors hover:text-foreground/80",
              pathname === link.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div
        className={cn("flex items-center gap-1", {
          "flex-col space-y-2": isCol,
        })}
      >
        {user?.id ? (
          <Link href="/app" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/auth" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Login
            </Link>
          </>
        )}
        <DarkModeSwitch />
      </div>
    </div>
  );
}
