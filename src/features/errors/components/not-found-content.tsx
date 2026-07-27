"use client";

/**
 * NotFoundContent — reusable 404 page content.
 *
 * Displays a 404 status with an icon, message, optional search,
 * and quick links to common pages. Animates in on mount.
 *
 * @example
 * <NotFoundContent />
 * <NotFoundContent message="Custom message" />
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSearch, Home, ArrowLeft, LayoutDashboard, User, Settings } from "lucide-react";
import { ERROR_MESSAGES, NOT_FOUND_QUICK_LINKS } from "../constants";

export interface NotFoundContentProps {
  /** Custom message override. */
  message?: string;
  /** Custom CSS class. */
  className?: string;
}

export function NotFoundContent({ message, className }: NotFoundContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredLinks = NOT_FOUND_QUICK_LINKS.filter((link) =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {/* Large 404 visual */}
      <div className="relative mb-8">
        <div className="text-[120px] font-bold leading-none tracking-tighter text-primary/10 select-none sm:text-[180px]">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <FileSearch className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Title & description */}
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {ERROR_MESSAGES.NOT_FOUND.TITLE}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {message || ERROR_MESSAGES.NOT_FOUND.DESCRIPTION}
      </p>

      {/* Search */}
      <div className="mt-8 w-full max-w-sm">
        <div className="relative">
          <FileSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={ERROR_MESSAGES.NOT_FOUND.SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-2">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label === "Dashboard" && <LayoutDashboard className="h-4 w-4" />}
              {link.label === "Profile" && <User className="h-4 w-4" />}
              {link.label === "Settings" && <Settings className="h-4 w-4" />}
              {link.label === "Home" && <Home className="h-4 w-4" />}
              {link.label}
            </Link>
          ))
        ) : (
          <p className="col-span-2 py-4 text-sm text-muted-foreground">
            {ERROR_MESSAGES.NOT_FOUND.NO_SEARCH_RESULTS}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex items-center gap-3">
        <Button variant="outline" onClick={() => window.history.back()} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          {ERROR_MESSAGES.NOT_FOUND.BACK}
        </Button>
        <Link href="/">
          <Button className="gap-1.5">
            <Home className="h-4 w-4" />
            {ERROR_MESSAGES.NOT_FOUND.GO_HOME}
          </Button>
        </Link>
      </div>
    </div>
  );
}
