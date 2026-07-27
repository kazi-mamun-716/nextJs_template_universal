"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteAccount } from "@/features/users/actions/delete-account";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

const deleteSchema = z.object({
  password: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
});

type DeleteFormValues = z.infer<typeof deleteSchema>;

/**
 * Delete account confirmation dialog.
 * Requires password confirmation before soft-deleting the account.
 */
export function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(deleteAccount, null);

  const {
    register,
    formState: { errors },
  } = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { password: "" },
  });

  // Redirect to home after successful deletion
  useEffect(() => {
    if (state?.success === true) {
      router.push(ROUTES.HOME);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Your account and all associated data will be permanently removed.
            Please enter your password to confirm.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} noValidate>
          {state?.success === false && !state.errors && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" isLoading={isPending}>
              Delete My Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
