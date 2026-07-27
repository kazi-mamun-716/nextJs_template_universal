import { z } from "zod";
import { REGEX } from "@/constants/regex";

/**
 * Email sending validation schema.
 */
export const sendEmailSchema = z.object({
  to: z.string().regex(REGEX.EMAIL, "Invalid recipient email"),
  subject: z.string().min(1, "Subject is required").max(200),
  html: z.string().min(1, "HTML content is required"),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
