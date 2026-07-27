"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { useTheme } from "next-themes";

interface ToastOptions {
  description?: string;
  duration?: number;
}

/**
 * Sonner toast configuration provider.
 * Renders the toast container with theme-aware styling.
 */
export function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme={resolvedTheme as "light" | "dark"}
      toastOptions={{
        style: {
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
      }}
    />
  );
}

/**
 * Typed toast notification API.
 * Can be used in both Server and Client Components.
 *
 * @example
 * import { toast } from "@/providers/toast-provider";
 *
 * toast.success("Profile updated");
 * toast.error("Something went wrong", { description: "Please try again" });
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, options);
  },
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },
};
