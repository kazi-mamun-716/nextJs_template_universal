"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { userService } from "@/features/users/services/user-service";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
    newPassword: z.string().min(8, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: MESSAGES.VALIDATION.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

/**
 * Changes the current user's password after verifying the current password.
 */
export async function changePassword(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: MESSAGES.ERROR.UNAUTHORIZED };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validation = changePasswordSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
      errors: fieldErrors,
    };
  }

  return userService.changePassword(
    session.user.id,
    validation.data.currentPassword,
    validation.data.newPassword,
  );
}
