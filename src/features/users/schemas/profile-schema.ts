import { z } from "zod";

/**
 * Profile update validation schema.
 */
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be under 100 characters").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
