"use server";

import type { ApiResponse } from "@/types/api";

/**
 * Creates a new user account.
 */
export async function register(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  // TODO: Implement registration logic
  return { success: false, message: "Not implemented" };
}
