import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Logo({
  withText = true,
  width = 135,
  height = 35,
  className,
  href = "/",
}: {
  withText?: boolean;
  width?: number;
  height?: number;
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href}>
      <Image
        width={width}
        height={height}
        src={`/${withText ? "logo-text.png" : "logo.png"}`}
        alt="KBaseBot Logo"
        className={cn(className)}
      />
    </Link>
  );
}
