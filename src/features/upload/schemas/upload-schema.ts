import { z } from "zod";

/**
 * File upload validation schema.
 */
export const uploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, "File cannot be empty"),
});

export type UploadInput = z.infer<typeof uploadSchema>;
