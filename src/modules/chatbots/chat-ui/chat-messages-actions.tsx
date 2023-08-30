import { type Message } from "ai";

import { Button } from "@/components/ui/button";
import { IconCheck, IconCopy } from "@/components/ui/icons";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();

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
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className="sr-only">{t("copyMessage")}</span>
      </Button>
    </div>
  );
}
