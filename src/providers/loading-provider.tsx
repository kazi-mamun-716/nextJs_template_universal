"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { LoadingSpinner } from "@/components/common/loading-spinner";

// ─── Types ──────────────────────────────────────────────

interface LoadingContextValue {
  /** Show the global loading overlay with an optional message. */
  start: (message?: string) => void;
  /** Hide the global loading overlay. */
  stop: () => void;
  /** Whether the loading overlay is currently visible. */
  isLoading: boolean;
}

// ─── Context ────────────────────────────────────────────

const LoadingContext = createContext<LoadingContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const start = useCallback((msg?: string) => {
    setMessage(msg ?? "Loading...");
    setIsLoading(true);
  }, []);

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ start, stop, isLoading }}>
      {children}

      {/* Fullscreen loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
          <LoadingSpinner size="lg" />
          {message && (
            <p className="text-sm text-muted-foreground animate-pulse">
              {message}
            </p>
          )}
        </div>
      )}
    </LoadingContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────

/**
 * Global loading state hook.
 *
 * @example
 * const { start, stop, isLoading } = useGlobalLoading();
 *
 * async function handleSubmit() {
 *   start("Saving...");
 *   await saveData();
 *   stop();
 * }
 */
export function useGlobalLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within a LoadingProvider");
  }
  return context;
}
