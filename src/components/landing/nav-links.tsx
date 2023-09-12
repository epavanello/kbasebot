"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/store/use-user";

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
      className={cn("flex items-center text-md flex-1 justify-end", {
        "flex-col space-y-6": isCol,
        "space-x-6 ": !isCol,
      })}
    >
      <div
        className={cn("flex justify-center flex-1", {
          "flex-col space-y-6 text-2xl items-center": isCol,
          "space-x-6": !isCol,
        })}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80 text-sm",
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
          <Link
            href="/app"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/auth"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
