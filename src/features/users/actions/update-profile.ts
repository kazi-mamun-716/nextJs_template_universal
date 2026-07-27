"use server";

import type { ApiResponse } from "@/types/api";

/**
 * Updates the current user's profile information.
 */
export async function updateProfile(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  // TODO: Implement profile update logic
  return { success: false, message: "Not implemented" };
}
