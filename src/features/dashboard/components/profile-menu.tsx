"use client";

/**
 * ProfileMenu — user menu dropdown with avatar, name, links, and logout.
 *
 * @example
 * <ProfileMenu
 *   userName="John Doe"
 *   userEmail="john@example.com"
 *   userImage="/avatar.jpg"
 *   onLogout={() => signOut()}
 * />
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { DASHBOARD_ROUTES } from "../routes";

export interface ProfileMenuProps {
  /** User display name. */
  userName?: string | null;
  /** User email address. */
  userEmail?: string | null;
  /** User avatar URL. */
  userImage?: string | null;
  /** Logout callback. */
  onLogout?: () => void;
  /** Custom CSS class. */
  className?: string;
}

export function ProfileMenu({
  userName,
  userEmail,
  userImage,
  onLogout,
  className,
}: ProfileMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent"
        aria-label="User menu"
        aria-expanded={open}
      >
        <Avatar src={userImage} name={userName ?? "User"} size="sm" />
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight">{userName ?? "User"}</p>
          <p className="text-xs text-muted-foreground leading-tight">{userEmail ?? ""}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-md border bg-popover p-1 shadow-md z-50">
          <div className="border-b px-2 py-2">
            <p className="text-sm font-medium">{userName ?? "User"}</p>
            <p className="text-xs text-muted-foreground">{userEmail ?? ""}</p>
          </div>

          <div className="py-1">
            <Link
              href={DASHBOARD_ROUTES.PROFILE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href={DASHBOARD_ROUTES.SETTINGS}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          {onLogout && (
            <div className="border-t pt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
