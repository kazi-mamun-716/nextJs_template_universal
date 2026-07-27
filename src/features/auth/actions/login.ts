"use server";

import { loginSchema } from "@/features/auth/schemas/login-schema";
import type { ApiResponse } from "@/types/api";

/**
 * Authenticates a user with email and password.
 */
export async function login(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  // TODO: Implement login logic with auth service
  return { success: false, message: "Not implemented" };
}
