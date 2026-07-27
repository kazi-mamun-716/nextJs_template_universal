/**
 * Blog Feature — Public API
 *
 * Export surface for all blog-related components, actions,
 * types, hooks, and configuration.
 *
 * @example
 * import { BlogCard, BlogList, createPost, getPublishedPosts } from "@/features/blog";
 * import type { IBlogPost, BlogPostSummary } from "@/features/blog";
 */

// ─── Components ──────────────────────────────────────
export { BlogCard, BlogCardSkeleton } from "./components/blog-card";
export { BlogList } from "./components/blog-list";

// ─── Server Actions ──────────────────────────────────
export { createPost } from "./actions/create-post";
export { getPublishedPosts, getPostsByQuery } from "./actions/get-posts";
export { getPostBySlug, getPostById } from "./actions/get-post";
export { updatePost } from "./actions/update-post";
export { deletePost } from "./actions/delete-post";

// ─── Services ────────────────────────────────────────
export { blogService } from "./services/blog.service";

// ─── Repository ──────────────────────────────────────
export { BlogRepository } from "./repositories/blog.repository";
export type { BlogFilter } from "./repositories/blog.repository";

// ─── Types ───────────────────────────────────────────
export type {
  IBlogPost,
  IPostStatus,
  CreatePostInput,
  UpdatePostInput,
  BlogPostSummary,
} from "./types";

// ─── Hooks ───────────────────────────────────────────
export { useBlogPosts } from "./hooks/use-blog";
export type { UseBlogPostsOptions } from "./hooks/use-blog";

// ─── Schemas ─────────────────────────────────────────
export { createPostSchema, updatePostSchema, blogQuerySchema } from "./schemas";
export type {
  CreatePostInput as CreatePostSchemaInput,
  UpdatePostInput as UpdatePostSchemaInput,
} from "./schemas";

// ─── Constants ───────────────────────────────────────
export { BLOG_MESSAGES, BLOG_LIMITS } from "./constants";

// ─── Routes ──────────────────────────────────────────
export { BLOG_ROUTES } from "./routes";
export type { BlogRoute } from "./routes";

// ─── Permissions ─────────────────────────────────────
export { canCreatePost, canEditAnyPost, canDeleteAnyPost, canModeratePosts } from "./permissions";

// ─── Config ──────────────────────────────────────────
export { blogFeatureConfig } from "./config";
