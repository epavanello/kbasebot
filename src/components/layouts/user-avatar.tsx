"use client";

import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { gradients } from "@/style/gradients";

interface UserAvatarProps extends AvatarProps {
  avatar_url?: string;
  full_name?: string;
  className?: string;
}

export const UserAvatar = ({ avatar_url, full_name, className }: UserAvatarProps) => {
  return (
    <Avatar className={`mr-2 h-10 w-10 p-[1px] ${gradients.SEAFOAM} ${className}`}>
      <AvatarImage referrerPolicy="no-referrer" src={avatar_url} alt={`${full_name} avatar`} className="rounded-full" />
      <AvatarFallback className={gradients.SEAFOAM}>
        <p className="text-lg text-white">{full_name?.[0]}</p>
      </AvatarFallback>
    </Avatar>
  );
};
