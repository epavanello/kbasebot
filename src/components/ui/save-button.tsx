"use client";

import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useBooleanTimeout } from "@/lib/hooks/use-boolean-timeout";
import { Icon } from "./icons";

interface SaveButtonProps extends React.ComponentProps<"div"> {
  variant?: "ghost" | "default" | "outline";
  size?: "sm" | "lg";
  className?: string;
  showText?: false;
  onSave?: () => void;
}
const SaveButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SaveButtonProps
>(
  (
    { className, variant = "ghost", showText = false, size = "sm", onSave },
    ref,
  ) => {
    const [isSaved, setIsSaved] = useBooleanTimeout();

    const handleOnSave = () => {
      setIsSaved();
      onSave?.();
    };

    return (
      <Button
        ref={ref}
        className={cn(className || "")}
        variant={variant as any}
        size={size as any}
        onClick={handleOnSave}
      >
        {isSaved ? <CheckIcon /> : <Icon icon="ion:save-outline" />}
        <span
          className={cn({
            "sr-only": !showText,
            "ml-1": showText,
          })}
        >
          Save
        </span>
      </Button>
    );
  },
);
SaveButton.displayName = "SaveButton";

export default SaveButton;
