/**
 * Server actions: get a single blog post.
 *
 * - getPostBySlug — public, fetches a published post by its URL slug
 * - getPostById — authenticated, fetches any post by ID (for admin)
 */
import { createAction } from "@/lib/api/action";
import { z } from "zod";
import { blogService } from "../services/blog.service";

const slugSchema = z.object({ slug: z.string().min(1) });
const idSchema = z.object({ id: z.string().min(1) });

export const getPostBySlug = createAction({
  schema: slugSchema,
  requireAuth: false,
  handler: async (data) => {
    return blogService.getBySlug(data.slug);
  },
});

export const getPostById = createAction({
  schema: idSchema,
  requireAuth: true,
  handler: async (data) => {
    return blogService.getById(data.id);
  },
});
