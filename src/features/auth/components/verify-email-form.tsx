"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/features/auth/actions/verify-email";
import { ROUTES } from "@/constants/routes";
import type { ApiResponse } from "@/types/api";

/**
 * Verify email form that validates the verification token from the URL.
 * Token is extracted from the search params (?token=...).
 */
export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(verifyEmail, null);

  // Show success state
  if (state?.success === true) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-primary/10 p-4 text-sm">
          <p className="font-medium text-primary">Email verified successfully!</p>
          <p className="mt-1 text-muted-foreground">
            Your email has been confirmed. You can now sign in to your account.
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in to your account
        </Link>
      </div>
    );
  }

  // Show error state
  if (state?.success === false) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Verification failed</p>
          <p className="mt-1">{state.message}</p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  // Show error if no token
  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Invalid verification link</p>
          <p className="mt-1">
            This email verification link is invalid or missing a token.
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <p className="text-center text-sm text-muted-foreground">
        Click the button below to verify your email address.
      </p>

      <Button type="submit" className="w-full" isLoading={isPending}>
        Verify Email
      </Button>
    </form>
  );
}
