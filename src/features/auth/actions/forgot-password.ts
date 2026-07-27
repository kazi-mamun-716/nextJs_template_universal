"use server";

import { createAction } from "@/lib/api";
import { forgotPasswordSchema } from "@/features/auth/schemas/password-schema";
import { authService } from "@/features/auth/services/auth-service";

/**
 * Sends a password reset email to the user.
 * Always returns success to prevent email enumeration.
 */
export const forgotPassword = createAction({
  schema: forgotPasswordSchema,
  requireAuth: false,
  handler: async (data) => {
    return authService.forgotPassword(data.email);
  },
});
