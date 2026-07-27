import { z } from "zod";

/**
 * User settings validation schema.
 */
export const userSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
});

export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;
