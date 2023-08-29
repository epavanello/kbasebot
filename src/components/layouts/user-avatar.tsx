"use client";

import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/auth-helpers-nextjs";
import { gradients } from "@/style/gradients";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
  className?: string;
}

export const UserAvatar = ({
  avatar_url,
  full_name,
  className,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={`mr-2 p-[1px] w-10 h-10 ${gradients.HYPER} ${className}`}
    >
      <AvatarImage
        referrerpolicy="no-referrer"
        src={avatar_url}
        alt={`${full_name} avatar`}
        className="rounded-full"
      />
      <AvatarFallback className={gradients.HYPER}>
        <p className="text-white text-lg">{full_name?.[0]}</p>
      </AvatarFallback>
    </Avatar>
  );
};
