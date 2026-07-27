/**
 * Blog feature constants.
 */
export const BLOG_MESSAGES = {
  CREATED: "Post created successfully.",
  UPDATED: "Post updated successfully.",
  DELETED: "Post deleted successfully.",
  FOUND: "Post retrieved successfully.",
  NOT_FOUND: "Post not found.",
  FORBIDDEN: "You do not have permission to modify this post.",
  SLUG_EXISTS: "A post with this URL slug already exists.",
  CREATE_ERROR: "Failed to create post. Please try again.",
  UPDATE_ERROR: "Failed to update post. Please try again.",
  DELETE_ERROR: "Failed to delete post. Please try again.",
  GET_ERROR: "Failed to retrieve posts. Please try again.",
} as const;

export const BLOG_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  EXCERPT_MAX_LENGTH: 500,
  TAGS_MAX_COUNT: 10,
  TAG_MAX_LENGTH: 50,
  SLUG_MAX_LENGTH: 100,
} as const;
