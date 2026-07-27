"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/features/auth/schemas/password-schema";
import { resetPassword } from "@/features/auth/actions/reset-password";
import { ROUTES } from "@/constants/routes";
import type { ApiResponse } from "@/types/api";
import { z } from "zod";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/**
 * Reset password form that validates the token and sets a new password.
 * Token is extracted from the URL search params (?token=...).
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(resetPassword, null);

  const {
    register,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  // Show success state
  if (state?.success === true) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-primary/10 p-4 text-sm">
          <p className="font-medium text-primary">Password reset successful</p>
          <p className="mt-1 text-muted-foreground">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in with new password
        </Link>
      </div>
    );
  }

  // Show error if no token
  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Invalid reset link</p>
          <p className="mt-1">This password reset link is invalid or missing a token.</p>
        </div>
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />

      {state?.success === false && !state.errors && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <Input
        label="New Password"
        type="password"
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" className="w-full" isLoading={isPending}>
        Reset Password
      </Button>
    </form>
  );
}
