"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/lib/store/use-user";
import { UserAvatar } from "@/components/layouts/user-avatar";
import { Icon } from "@/components/ui/icons";

export function UserAccountNav({ className }) {
  const { user, userDetails } = useUser();
  const { reload, push } = useRouter();
  const supabase = useSupabaseClient();

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    return reload();
  };

  //account
  const { email } = user || {};
  const { avatar_url, full_name } = userDetails || {};

  // if (!user?.id) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          role="combobox"
          aria-label="Select a team"
          className={cn("flex justify-between", className)}
        >
          <UserAvatar avatar_url={avatar_url} full_name={full_name || "@"} />
          <span className="mr-1">{full_name}</span>
          <Icon
            icon="ep:arrow-down"
            className="ml-auto text-lg shrink-0 opacity-50"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => push("/app/account")}>
            <Icon icon="carbon:settings" className="mr-2 text-xl" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogOut}>
          <Icon icon="solar:logout-linear" className="mr-2 text-xl" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
