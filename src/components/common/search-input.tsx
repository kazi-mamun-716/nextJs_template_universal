"use client";

/**
 * Search input with debounced onChange.
 *
 * Provides a controlled search input that debounces the onChange callback
 * to avoid excessive filtering/search requests while typing.
 *
 * @example
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search users..."
 * />
 */

import { useCallback, useRef, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Called with the debounced value */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms (default: 300) */
  delay?: number;
  /** Custom class name */
  className?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Label for accessibility (default: "Search") */
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  delay = 300,
  className,
  disabled = false,
  label = "Search",
}: SearchInputProps) {
  // Internal value for smooth typing
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, delay);
    },
    [delay, onChange],
  );

  const handleClear = useCallback(() => {
    // Clear pending debounce before updating state to prevent a stale
    // debounced onChange from firing after the clear, which would
    // re-populate the search value the user just cleared.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLocalValue("");
    onChange("");
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Allow Escape key to clear the search
      if (e.key === "Escape" && localValue) {
        handleClear();
      }
    },
    [handleClear, localValue],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 pr-8",
          "text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
        )}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "rounded-sm p-0.5 text-muted-foreground",
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "transition-colors duration-200",
          )}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
