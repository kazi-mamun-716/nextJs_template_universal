"use server";

import type { ApiResponse } from "@/types/api";

/**
 * Logs out the current user.
 */
export async function logout(): Promise<ApiResponse> {
  // TODO: Implement logout logic
  return { success: true, message: "Logged out" };
}
