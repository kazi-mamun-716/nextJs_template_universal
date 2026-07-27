"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ──────────────────────────────────────────────

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const isOpen = options !== null;

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(opts);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) handleCancel();
    },
    [handleCancel],
  );

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{options?.title}</DialogTitle>
            <DialogDescription>{options?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {options?.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant={options?.variant ?? "default"}
              onClick={handleConfirm}
            >
              {options?.confirmLabel ?? "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────

/**
 * Confirmation dialog hook.
 *
 * @example
 * const { confirm } = useConfirm();
 *
 * async function handleDelete() {
 *   const confirmed = await confirm({
 *     title: "Delete user?",
 *     message: "This action cannot be undone.",
 *     variant: "destructive",
 *   });
 *   if (confirmed) await deleteUser(id);
 * }
 */
export function useConfirm(): ConfirmContextValue {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
