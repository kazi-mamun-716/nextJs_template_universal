import { z } from "zod";
import { REGEX } from "@/constants/regex";
import { MESSAGES } from "@/constants/messages";

/**
 * Forgot password form validation schema.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, MESSAGES.VALIDATION.REQUIRED).regex(REGEX.EMAIL, MESSAGES.VALIDATION.INVALID_EMAIL),
});

/**
 * Reset password form validation schema.
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.VALIDATION.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });
