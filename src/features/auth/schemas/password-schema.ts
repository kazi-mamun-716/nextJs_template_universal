import { z } from "zod";
import { REGEX } from "@/constants/regex";
import { MESSAGES } from "@/constants/messages";

/**
 * Forgot password form validation schema.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, MESSAGES.REQUIRED_FIELD).regex(REGEX.EMAIL, MESSAGES.INVALID_EMAIL),
});

/**
 * Reset password form validation schema.
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.REQUIRED_FIELD),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });
