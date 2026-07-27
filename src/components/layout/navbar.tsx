"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/features/theme";
import { Container } from "@/components/layout/container";
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  /** Whether this nav item requires authentication */
  protected?: boolean;
}

interface NavbarProps {
  /** Brand/logo component or text */
  brand?: React.ReactNode;
  /** Navigation items for the main menu */
  navItems?: NavItem[];
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Whether to show the theme toggle */
  showThemeToggle?: boolean;
  /** Whether the user is authenticated */
  isAuthenticated?: boolean;
  /** User name for the profile menu */
  userName?: string;
  /** User image for the avatar */
  userImage?: string;
  /** Callback when logout is clicked */
  onLogout?: () => void;
  /** Additional className */
  className?: string;
  /** Whether the navbar is in dark/transparent mode for hero sections */
  transparent?: boolean;
}

// ─── Component ──────────────────────────────────────────

/**
 * Responsive navigation bar with logo, nav links, search, theme toggle, and profile.
 *
 * @example
 * <Navbar
 *   brand={<span className="font-bold">MyApp</span>}
 *   navItems={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
 *   isAuthenticated={!!session}
 *   userName={session?.user?.name}
 *   userImage={session?.user?.image}
 * />
 */
export function Navbar({
  brand,
  navItems = [],
  showSearch = false,
  showThemeToggle = true,
  isAuthenticated = false,
  userName,
  userImage,
  onLogout,
  className,
  transparent = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b",
        transparent
          ? "border-transparent bg-transparent"
          : "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            {brand ? (
              brand
            ) : (
              <Link href="/" className="text-lg font-bold tracking-tight">
                NextPlate
              </Link>
            )}

            {/* Desktop Nav */}
            {navItems.length > 0 && (
              <nav className="hidden md:flex md:items-center md:gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            {showSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Toggle search"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Theme toggle */}
            {showThemeToggle && <ThemeToggle />}

            {/* Notifications (authenticated only) */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
            )}

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent"
                >
                  <Avatar src={userImage} name={userName} size="sm" />
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
                    <div className="border-b px-2 py-1.5">
                      <p className="text-sm font-medium">{userName ?? "User"}</p>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout?.();
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Container>

      {/* Search bar (expandable) */}
      {showSearch && searchOpen && (
        <div className="border-t px-4 py-3">
          <Container>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
              />
            </div>
          </Container>
        </div>
      )}

      {/* Mobile navigation drawer */}
      {mobileOpen && navItems.length > 0 && (
        <div className="border-t md:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="mt-2 flex flex-col gap-2 border-t pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
