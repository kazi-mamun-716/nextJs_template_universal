"use server";

import { registerSchema } from "@/features/auth/schemas/register-schema";
import { authService } from "@/features/auth/services/auth-service";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

/**
 * Creates a new user account.
 * Validates input, checks for duplicate emails, and creates the user via auth service.
 *
 * @param _prevState - Previous form state (for useActionState)
 * @param formData - Form data with name, email, password, and confirmPassword
 * @returns API response with success/error status
 */
export async function register(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  // Parse and validate form data
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
      errors: fieldErrors,
    };
  }

  return authService.register({
    email: validation.data.email,
    password: validation.data.password,
    name: validation.data.name,
  });
}
