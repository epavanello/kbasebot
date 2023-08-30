"use client";
// This is an extra step because iconify icon's doesn't have autocomplete working correctly for import, with these,
// we can get auto import, and that accelerate the development speed
import * as React from "react";
import { cn } from "@/lib/utils";

import { Icon } from "@iconify/react";

export { Icon };

export const CloseIcon = ({ className }) => (
  <Icon
    icon="icon-park-outline:close"
    className={cn("text-2xl", className || "")}
  />
);

export const LOADING_ICON = "line-md:loading-loop";

export const LoadingIcon = ({ className }) => (
  <Icon icon={LOADING_ICON} className={cn("text-2xl", className || "")} />
);
