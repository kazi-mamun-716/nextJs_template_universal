import { z } from "zod";
import { REGEX } from "@/constants/regex";
import { MESSAGES } from "@/constants/messages";

/**
 * Login form validation schema.
 */
export const loginSchema = z.object({
  email: z.string().min(1, MESSAGES.VALIDATION.REQUIRED).regex(REGEX.EMAIL, MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, MESSAGES.VALIDATION.REQUIRED),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
