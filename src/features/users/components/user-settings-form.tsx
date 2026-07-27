"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { userSettingsSchema, type UserSettingsFormValues } from "@/features/users/schemas/user-settings-schema";
import { updateSettings } from "@/features/users/actions/update-settings";
import type { ApiResponse } from "@/types/api";

/**
 * User settings form for managing preferences.
 */
export function UserSettingsForm() {
  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(updateSettings, null);

  const {
    register,
    formState: { errors },
  } = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      theme: "system",
      emailNotifications: true,
      language: "en",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent className="space-y-4">
          {state?.success === true && (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              {state.message}
            </div>
          )}

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Theme
            </label>
            <select
              {...register("theme")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            {errors.theme && (
              <p className="text-sm text-destructive">{errors.theme.message}</p>
            )}
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium leading-none">Email Notifications</label>
              <p className="text-xs text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <input
              type="checkbox"
              {...register("emailNotifications")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Language
            </label>
            <select
              {...register("language")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            {errors.language && (
              <p className="text-sm text-destructive">{errors.language.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" isLoading={isPending}>
            Save Settings
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
