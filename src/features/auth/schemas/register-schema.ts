import { z } from "zod";
import { REGEX } from "@/constants/regex";
import { MESSAGES } from "@/constants/messages";

/**
 * Registration form validation schema.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().min(1, MESSAGES.VALIDATION.REQUIRED).regex(REGEX.EMAIL, MESSAGES.VALIDATION.INVALID_EMAIL),
    password: z.string().min(8, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.VALIDATION.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
