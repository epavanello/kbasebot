"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Logo from "@/components/landing/logo";
import NavLinks from "@/components/landing/nav-links";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function NavSheet() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon className="text-4xl" icon={"ic:baseline-menu"} />
        </Button>
      </SheetTrigger>
      <SheetContent
        closeBtnClass="w-8 h-8"
        className="w-full bg-opacity-40 bg-clip-padding backdrop-blur-md backdrop-filter"
      >
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center"></div>
            </div>
            <div>
              <div className="mt-3 flex h-[70vh] items-center justify-center">
                <NavLinks isCol />
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
