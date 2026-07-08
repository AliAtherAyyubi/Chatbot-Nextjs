"use client";

import { BadgeCheckIcon, SunMoon, LogOutIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileSettings() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Account";
  const email = user?.email ?? "";

  return (
    <DropdownMenu closeParentOnEsc={true}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="w-full justify-start gap-2.5 px-2 h-auto py-2 rounded-xl">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={fullName} />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden text-left">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "var(--color-text)" }}
              >
                {fullName}
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--color-text-muted)" }}
              >
                {email}
              </p>
            </div>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              toggleTheme();
            }}
          >
            <SunMoon />
            <div className="flex items-center justify-between flex-1 gap-2">
              <span>Dark mode</span>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
