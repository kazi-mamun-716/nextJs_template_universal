"use server";

import { auth } from "@/lib/auth";
import { userSettingsSchema } from "@/features/users/schemas/user-settings-schema";
import { userService } from "@/features/users/services/user-service";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

/**
 * Updates the current user's settings (theme, notifications, language).
 */
export async function updateSettings(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: MESSAGES.ERROR.UNAUTHORIZED };
  }

  const rawData = {
    theme: formData.get("theme") as "light" | "dark" | "system",
    emailNotifications: formData.get("emailNotifications") === "true",
    language: formData.get("language") as string,
  };

  const validation = userSettingsSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return userService.updateSettings(session.user.id, validation.data);
}
