"use server";

import { auth } from "@/lib/auth";
import { profileSchema } from "@/features/users/schemas/profile-schema";
import { userService } from "@/features/users/services/user-service";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

/**
 * Updates the current user's profile information.
 * Requires authentication.
 */
export async function updateProfile(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: MESSAGES.ERROR.UNAUTHORIZED };
  }

  // Parse and validate form data
  const rawData = {
    name: formData.get("name") as string,
    bio: formData.get("bio") as string,
    website: formData.get("website") as string,
    location: formData.get("location") as string,
  };

  const validation = profileSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
      errors: fieldErrors,
    };
  }

  return userService.updateProfile(session.user.id, validation.data);
}
