/**
 * Blog feature Zod validation schemas.
 *
 * Reuses field builders from @/lib/validation where applicable.
 */
import { z } from "zod";
import { fields } from "@/lib/validation";

/** Regex for valid URL slugs: lowercase alphanumeric + hyphens. */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens").optional(),
  excerpt: z.string().max(500).optional().default(""),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Cover image must be a valid URL").optional(),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens").optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url("Cover image must be a valid URL").optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  status: z.enum(["draft", "published", "archived"]).optional(),
  authorId: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  search: z.string().max(200).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
