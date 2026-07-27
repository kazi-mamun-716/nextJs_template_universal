"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { login } from "@/features/auth/actions/login";
import { ROUTES } from "@/constants/routes";
import type { LoginFormValues } from "@/features/auth/types";
import type { ApiResponse } from "@/types/api";

/**
 * Login form with email and password fields.
 * Uses React Hook Form with Zod validation and server action submission.
 */
export function LoginForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(login, null);

  const {
    register: registerField,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle successful login — redirect to dashboard
  useEffect(() => {
    if (state?.success && state.data && typeof state.data === "object" && "redirectTo" in state.data) {
      const redirectTo = (state.data as Record<string, unknown>).redirectTo as string;
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.success === false && !state.errors && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...registerField("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...registerField("password")}
      />

      <div className="flex items-center justify-end">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" isLoading={isPending}>
        Sign In
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
