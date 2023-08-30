"use-client";

import { type Message } from "ai";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:right-2 md:-top-2 md:opacity-0",
        className || "",
      )}
      {...props}
    >
      <Button
        className="bg-gray-100/90"
        variant="ghost"
        size="icon"
        onClick={onCopy}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  );
}
