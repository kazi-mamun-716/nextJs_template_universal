"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/features/auth/schemas/password-schema";
import { forgotPassword } from "@/features/auth/actions/forgot-password";
import { ROUTES } from "@/constants/routes";
import type { ApiResponse } from "@/types/api";
import { z } from "zod";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot password form that sends a password reset email.
 */
export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(forgotPassword, null);

  const {
    register,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Show success state regardless (prevents email enumeration)
  if (state?.success === true) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-primary/10 p-4 text-sm">
          <p className="font-medium text-primary">Check your email</p>
          <p className="mt-1 text-muted-foreground">
            If an account exists with that email, we&apos;ve sent password reset instructions.
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <p className="text-sm text-muted-foreground">
        Enter your email address and we&apos;ll send you instructions to reset your password.
      </p>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Button type="submit" className="w-full" isLoading={isPending}>
        Send Reset Instructions
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
