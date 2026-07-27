"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import type { ApiResponse } from "@/types/api";

/**
 * Authenticates a user with email and password via Auth.js Credentials provider.
 *
 * @param _prevState - Previous form state (unused, for useActionState compatibility)
 * @param formData - Form data with email and password fields
 * @returns API response with success/error status
 */
export async function login(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  // Parse and validate form data
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
      errors: fieldErrors,
    };
  }

  try {
    const result = await signIn("credentials", {
      email: validation.data.email,
      password: validation.data.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS,
      };
    }

    return {
      success: true,
      message: MESSAGES.SUCCESS.LOGGED_IN,
      data: { redirectTo: ROUTES.DASHBOARD_HOME },
    };
  } catch {
    return {
      success: false,
      message: MESSAGES.ERROR.DEFAULT,
    };
  }
}
