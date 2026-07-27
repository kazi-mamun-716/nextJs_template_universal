"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema, type ProfileFormValues } from "@/features/users/schemas/profile-schema";
import { updateProfile } from "@/features/users/actions/update-profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import type { ApiResponse } from "@/types/api";

/**
 * User profile edit form.
 * Allows updating name, bio, website, and location.
 */
export function UserProfile({ user }: { user: { name?: string; email?: string } }) {
  const [state, formAction, isPending] = useActionState<ApiResponse | null, FormData>(updateProfile, null);

  const {
    register,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      bio: "",
      website: "",
      location: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
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
            label="Email"
            type="email"
            value={user.email ?? ""}
            disabled
            description="Email cannot be changed"
          />

          <Input
            label="Name"
            placeholder="Your full name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Bio"
            placeholder="Tell us about yourself"
            error={errors.bio?.message}
            {...register("bio")}
          />

          <Input
            label="Website"
            type="url"
            placeholder="https://yoursite.com"
            error={errors.website?.message}
            {...register("website")}
          />

          <Input
            label="Location"
            placeholder="City, Country"
            error={errors.location?.message}
            {...register("location")}
          />
        </CardContent>

        <CardFooter>
          <Button type="submit" isLoading={isPending}>
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
