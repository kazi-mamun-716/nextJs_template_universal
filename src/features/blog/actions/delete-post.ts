/**
 * Server action: delete a blog post (soft-delete).
 *
 * Requires authentication. Only the post's author can delete it.
 */
import { createAction } from "@/lib/api/action";
import { z } from "zod";
import { blogService } from "../services/blog.service";

const deletePostSchema = z.object({
  postId: z.string().min(1),
});

export const deletePost = createAction({
  schema: deletePostSchema,
  requireAuth: true,
  handler: async (data, { userId }) => {
    return blogService.delete(data.postId, userId);
  },
});
