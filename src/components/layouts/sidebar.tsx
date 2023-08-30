"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

interface ItemStatus {
  className?: string;
  text: string;
}

export interface SidebarItem {
  href: string;
  title: string;
  icon: any; // 'any' can be replaced with the specific type for the icons used
  disabled?: boolean;
  className?: string;
  status?: ItemStatus;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: FC<SidebarProps> = ({ items }) => {
  const path = usePathname();

  return (
    <nav className="grid items-start gap-2 p-2">
      {items.map((item, index) => {
        return (
          item.href && (
            <Link
              className={cn({
                "pointer-events-none opacity-30": !!item.disabled,
              })}
              key={index}
              href={item.href}
            >
              <span
                className={cn(
                  "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary",
                  path === item.href ? "bg-secondary" : "transparent",
                  item.className || "",
                )}
              >
                <Icon className="mr-2 text-xl" icon={item.icon} />
                <span className="text-sm">{item.title}</span>
                {!!item.status && (
                  <Badge
                    className={cn(
                      "absolute right-1 bottom-1 text-[10px] px-[6px] py-[0px]",
                      item.status.className || "",
                    )}
                  >
                    {item.status?.text}
                  </Badge>
                )}
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
};

export default Sidebar;
