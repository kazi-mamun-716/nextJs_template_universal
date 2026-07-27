"use server";

import { forgotPasswordSchema } from "@/features/auth/schemas/password-schema";
import { authService } from "@/features/auth/services/auth-service";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

/**
 * Sends a password reset email to the user.
 * Always returns success to prevent email enumeration.
 *
 * @param _prevState - Previous form state (for useActionState)
 * @param formData - Form data with email field
 * @returns API response
 */
export async function forgotPassword(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  const rawData = {
    email: formData.get("email") as string,
  };

  const validation = forgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
      errors: fieldErrors,
    };
  }

  return authService.forgotPassword(validation.data.email);
}
