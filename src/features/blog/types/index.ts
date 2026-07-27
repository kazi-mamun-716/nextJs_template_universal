/**
 * Blog feature type definitions.
 *
 * @example
 * import type { IBlogPost, IPostStatus, CreatePostInput } from "@/features/blog";
 */

/** Possible blog post statuses. */
export type IPostStatus = "draft" | "published" | "archived";

/** Blog post document shape (matches Mongoose model + serialised _id). */
export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: IPostStatus;
  publishedAt?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

/** Fields required to create a new post. */
export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status?: IPostStatus;
}

/** Fields that can be updated on an existing post. */
export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  status?: IPostStatus;
}

/** Summary shape used in list views (no full content). */
export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  status: IPostStatus;
  publishedAt?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
