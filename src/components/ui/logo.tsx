import React from "react";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/config/app.config";
import { cn } from "@/lib/utils";

const Logo = ({ className }) => {
  return (
    <Image
      alt={`${APP_CONFIG.name} Logo`}
      width={100}
      height={100}
      className={cn(
        "relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full border border-primary",
        className,
      )}
      src={APP_CONFIG.logo}
    />
  );
};

export default Logo;
