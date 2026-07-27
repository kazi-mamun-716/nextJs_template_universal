"use server";

import type { ApiResponse } from "@/types/api";

/**
 * Resets a user's password using a reset token.
 */
export async function resetPassword(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  // TODO: Implement password reset logic
  return { success: false, message: "Not implemented" };
}
