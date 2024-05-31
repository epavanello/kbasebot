import React from "react";
import { Icon, LoadingIcon } from "@/components/ui/icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Chunk } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const chunkMap = new Map<string, Chunk>();

export type PreviewProps = {
  icon: string;
  children: React.ReactNode;
  setOpen?: (isOpen: boolean) => void;
  iconClassName?: string;
  contentClassName?: string;
};

export const Preview = ({ icon, children, setOpen, iconClassName, contentClassName }: PreviewProps) => {
  return (
    <div className={cn(iconClassName)}>
      <HoverCard onOpenChange={(isOpen) => setOpen?.(isOpen)}>
        <HoverCardTrigger>
          <Icon icon={icon} className="inline-block h-4 w-4 text-black opacity-50 dark:text-white" />
        </HoverCardTrigger>
        <HoverCardContent
          className={cn(
            "flex max-h-[80vh] w-[512px] flex-col divide-y overflow-auto rounded-lg bg-background",
            contentClassName,
          )}
          side="left"
        >
          {children ? (
            children
          ) : (
            <div className="flex flex-row items-center">
              <LoadingIcon className="mx-auto text-3xl" />
            </div>
          )}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
