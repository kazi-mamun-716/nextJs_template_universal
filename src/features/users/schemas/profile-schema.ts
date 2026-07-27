import { z } from "zod";

/**
 * Profile update validation schema.
 */
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
