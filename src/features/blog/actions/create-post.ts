/**
 * Server action: create a new blog post.
 *
 * Requires authentication. Generates slug from title if not provided.
 */
import { createAction } from "@/lib/api/action";
import { createPostSchema } from "../schemas";
import { blogService } from "../services/blog.service";

export const createPost = createAction({
  schema: createPostSchema,
  requireAuth: true,
  handler: async (data, { userId }) => {
    // In a real app, fetch the user name from the session.
    // Here we use a placeholder — extend with user name lookup when profile service exists.
    const userName = "Author";

    return blogService.create(userId, userName, data);
  },
});
