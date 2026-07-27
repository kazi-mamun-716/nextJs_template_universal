/**
 * Server actions: fetch blog posts.
 *
 * Provides two public actions:
 * - getPublishedPosts — paginated published posts for the public blog listing
 * - getPostsByQuery — filtered listing for admin dashboard
 */
import { createAction } from "@/lib/api/action";
import { blogQuerySchema } from "../schemas";
import { blogService } from "../services/blog.service";

/**
 * Get paginated published posts.
 * No authentication required — used for the public blog listing.
 */
export const getPublishedPosts = createAction({
  schema: blogQuerySchema.pick({ page: true, pageSize: true }),
  requireAuth: false,
  handler: async (data) => {
    return blogService.getPublished(data.page, data.pageSize);
  },
});

/**
 * Get posts filtered by query params.
 * Requires authentication — used for the admin dashboard.
 */
export const getPostsByQuery = createAction({
  schema: blogQuerySchema,
  requireAuth: true,
  handler: async (data) => {
    const { page, pageSize } = data;
    // For now, return published posts. Extend with BlogRepository.findAllByFilter.
    return blogService.getPublished(page, pageSize);
  },
});
