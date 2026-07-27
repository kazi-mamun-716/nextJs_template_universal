/**
 * Server action: update an existing blog post.
 *
 * Requires authentication. Only the post's author can update it.
 */
import { createAction } from "@/lib/api/action";
import { z } from "zod";
import { updatePostSchema } from "../schemas";
import { blogService } from "../services/blog.service";

const updatePostActionSchema = z.object({
  postId: z.string().min(1),
  ...updatePostSchema.shape,
});

export const updatePost = createAction({
  schema: updatePostActionSchema,
  requireAuth: true,
  handler: async (data, { userId }) => {
    const { postId, ...updateData } = data;
    return blogService.update(postId, userId, updateData);
  },
});
