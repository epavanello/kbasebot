import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <div className="relative">
      {children}

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default", size: "sm" }), "absolute right-4 top-4 md:right-8 md:top-8")}
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default Layout;
