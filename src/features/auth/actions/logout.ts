"use server";

import { signOut } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

/**
 * Logs out the current user via Auth.js.
 *
 * @returns API response indicating successful logout
 */
export async function logout(): Promise<ApiResponse> {
  try {
    await signOut({ redirect: false });
    return {
      success: true,
      message: MESSAGES.SUCCESS.LOGGED_OUT,
      data: { redirectTo: ROUTES.HOME },
    };
  } catch {
    return {
      success: false,
      message: MESSAGES.ERROR.DEFAULT,
    };
  }
}
