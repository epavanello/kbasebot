"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useBooleanTimeout } from "@/lib/hooks/use-boolean-timeout";
import { Icon } from "./icons";

interface ActionButtonProps {
  icon: string;
  variant?: "ghost" | "default" | "outline";
  size?: "sm" | "lg";
  showText?: false;
  onClick?: () => void;
}
const ActionButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & ActionButtonProps
>(({ className, variant = "ghost", showText = false, size = "sm", icon, onClick, ...props }, ref) => {
  const [isClicked, setIsClicked] = useBooleanTimeout();

  const handleOnClick = () => {
    onClick?.();
    setIsClicked();
  };

  return (
    <Button
      ref={ref}
      className={cn(className || "")}
      variant={variant as any}
      size={size as any}
      onClick={handleOnClick}
      {...props}
    >
      {isClicked ? <CheckIcon /> : <Icon icon={icon} />}
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
});
ActionButton.displayName = "SaveButton";

export default ActionButton;
