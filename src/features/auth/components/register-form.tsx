"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/features/auth/schemas/register-schema";
import { register as registerAction } from "@/features/auth/actions/register";
import { ROUTES } from "@/constants/routes";
import type { RegisterFormValues } from "@/features/auth/types";
import type { ApiResponse } from "@/types/api";

/**
 * Registration form with name, email, password, and confirm password.
 * Uses React Hook Form with Zod validation and server action submission.
 */
export function RegisterForm() {
  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(registerAction, null);

  const {
    register: registerField,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.success === false && !state.errors && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      {state?.success === true && (
        <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
          {state.message}
        </div>
      )}

      <Input
        label="Name"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.name?.message}
        {...registerField("name")}
      />

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
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...registerField("password")}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...registerField("confirmPassword")}
      />

      <Button type="submit" className="w-full" isLoading={isPending}>
        Create Account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
