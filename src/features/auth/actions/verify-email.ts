"use server";

import { authService } from "@/features/auth/services/auth-service";
import type { ApiResponse } from "@/types/api";
import { z } from "zod";
import { MESSAGES } from "@/constants/messages";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

/**
 * Verifies a user's email address using a verification token.
 *
 * @param _prevState - Previous form state (for useActionState)
 * @param formData - Form data with token field
 * @returns API response
 */
export async function verifyEmail(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  const rawData = {
    token: formData.get("token") as string,
  };

  const validation = verifyEmailSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
    };
  }

  return authService.verifyEmail(validation.data.token);
}
