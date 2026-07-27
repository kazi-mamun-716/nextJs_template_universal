"use server";

import type { ApiResponse } from "@/types/api";

/**
 * Retrieves a paginated list of users.
 */
export async function getUsers(): Promise<ApiResponse> {
  // TODO: Implement user retrieval logic
  return { success: false, message: "Not implemented" };
}
