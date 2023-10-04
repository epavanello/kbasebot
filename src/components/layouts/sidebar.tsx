"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";
import { menus } from "@/lib/config/menus";

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

function SidebarItem(item: SidebarItem) {
  const path = usePathname();
  return (
    item.href && (
      <Link
        className={cn({
          "pointer-events-none opacity-30": !!item.disabled,
        })}
        key={item.href}
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
}

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const { chatbot_id } = useParams<{ chatbot_id: string }>();

  const insideChatbot = !!chatbot_id;
  const items = insideChatbot
    ? menus.sidebarNavByChatbot(chatbot_id)
    : menus.sidebarNav;

  return (
    <nav className="grid items-start gap-2 p-2">{items.map(SidebarItem)}</nav>
  );
};

export default Sidebar;
