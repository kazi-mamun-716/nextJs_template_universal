"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { userService } from "@/features/users/services/user-service";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types/api";

const deleteAccountSchema = z.object({
  password: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
});

/**
 * Permanently (soft-)deletes the current user's account.
 * Requires password confirmation for security.
 */
export async function deleteAccount(
  _prevState: ApiResponse | null,
  formData: FormData,
): Promise<ApiResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: MESSAGES.ERROR.UNAUTHORIZED };
  }

  const password = formData.get("password") as string;

  const validation = deleteAccountSchema.safeParse({ password });
  if (!validation.success) {
    return {
      success: false,
      message: MESSAGES.ERROR.VALIDATION_ERROR,
    };
  }

  return userService.deleteAccount(session.user.id, validation.data.password);
}
