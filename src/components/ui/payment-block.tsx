import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icons";
import { redirect } from "next/navigation";

const PaymentBlock = ({
  text = "Upgrade your account",
  isBlocked = false,
  btnText = "Upgrade your account",
  children,
}) => {
  return (
    <div className={cn({ "blur-overlay": isBlocked })}>
      {children}
      {isBlocked && (
        <div className="blur-content flex justify-center items-center flex-col gap-4">
          <Icon icon={"solar:lock-linear"} className="text-6xl opacity-70" />
          <h2 className="text-2xl font-semibold opacity-70">{text}</h2>
          <Link className={cn(buttonVariants({ variant: "default", size: "lg" }))} href="/pricing">
            {btnText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentBlock;
