"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { changePassword } from "@/features/users/actions/change-password";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
    newPassword: z.string().min(8, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: MESSAGES.VALIDATION.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

/**
 * Change password form with current password verification.
 */
export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(changePassword, null);

  const {
    register,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent className="space-y-4">
          {state?.success === true && (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              {state.message}
            </div>
          )}
          {state?.success === false && !state.errors && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.message}
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </CardContent>

        <CardFooter>
          <Button type="submit" isLoading={isPending}>
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
