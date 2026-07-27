/**
 * Blog service — orchestrates blog post business logic.
 *
 * Handles post creation, publishing, searching, and management.
 * Delegates data access to the BlogRepository.
 */
import { slugify } from "@/utils/string/slug";
import { BlogRepository } from "../repositories/blog.repository";
import { BLOG_MESSAGES } from "../constants";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { BlogPostSummary, CreatePostInput, UpdatePostInput } from "../types";

const blogRepo = new BlogRepository();

/** Convert a raw document to a summary-safe shape. */
function toSummary(doc: Record<string, unknown>): BlogPostSummary {
  return {
    id: String(doc.id ?? doc._id),
    title: doc.title as string,
    slug: doc.slug as string,
    excerpt: (doc.excerpt as string) ?? "",
    coverImage: doc.coverImage as string | undefined,
    tags: (doc.tags as string[]) ?? [],
    status: doc.status as BlogPostSummary["status"],
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt as string).toISOString() : undefined,
    authorId: String(doc.authorId),
    authorName: doc.authorName as string,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  };
}

export const blogService = {
  /**
   * Create a new blog post.
   * Generates a slug from the title if not provided.
   */
  async create(
    userId: string,
    userName: string,
    input: CreatePostInput,
  ): Promise<ApiResponse<BlogPostSummary>> {
    try {
      const slug = input.slug ?? slugify(input.title, { maxLength: 100 });
      const now = new Date();

      const post = (await blogRepo.create({
        title: input.title,
        slug,
        excerpt: input.excerpt ?? "",
        content: input.content,
        coverImage: input.coverImage,
        tags: input.tags ?? [],
        status: input.status ?? "draft",
        publishedAt: input.status === "published" ? now : undefined,
        authorId: userId as any,
        authorName: userName,
      } as any)) as unknown as Record<string, unknown>;

      return {
        success: true,
        message: BLOG_MESSAGES.CREATED,
        data: toSummary(post),
      };
    } catch (error) {
      const message =
        (error as { code?: number })?.code === 11000
          ? BLOG_MESSAGES.SLUG_EXISTS
          : BLOG_MESSAGES.CREATE_ERROR;
      return { success: false, message };
    }
  },

  /**
   * Get a published post by slug.
   */
  async getBySlug(slug: string): Promise<ApiResponse<BlogPostSummary>> {
    try {
      const post = (await blogRepo.findBySlug(slug)) as unknown as Record<string, unknown> | null;
      if (!post) {
        return { success: false, message: BLOG_MESSAGES.NOT_FOUND };
      }
      return { success: true, message: BLOG_MESSAGES.FOUND, data: toSummary(post) };
    } catch {
      return { success: false, message: BLOG_MESSAGES.GET_ERROR };
    }
  },

  /**
   * Get a single post by ID (for admin — includes drafts).
   */
  async getById(id: string): Promise<ApiResponse<BlogPostSummary>> {
    try {
      const post = (await blogRepo.findById(id)) as unknown as Record<string, unknown> | null;
      if (!post || post.isDeleted) {
        return { success: false, message: BLOG_MESSAGES.NOT_FOUND };
      }
      return { success: true, message: BLOG_MESSAGES.FOUND, data: toSummary(post) };
    } catch {
      return { success: false, message: BLOG_MESSAGES.GET_ERROR };
    }
  },

  /**
   * Get published posts with pagination.
   */
  async getPublished(page = 1, pageSize = 10): Promise<ApiResponse<BlogPostSummary[]>> {
    try {
      const result = await blogRepo.findPublished({ page, pageSize });
      return {
        success: true,
        message: BLOG_MESSAGES.FOUND,
        data: (result.data ?? []).map((p) => toSummary(p as unknown as Record<string, unknown>)),
        pagination: result.pagination,
      } as ApiResponse<BlogPostSummary[]>;
    } catch {
      return { success: false, message: BLOG_MESSAGES.GET_ERROR };
    }
  },

  /**
   * Update an existing blog post.
   */
  async update(
    postId: string,
    userId: string,
    input: UpdatePostInput,
  ): Promise<ApiResponse<BlogPostSummary>> {
    try {
      const existing = (await blogRepo.findById(postId)) as unknown as Record<
        string,
        unknown
      > | null;
      if (!existing || existing.isDeleted) {
        return { success: false, message: BLOG_MESSAGES.NOT_FOUND };
      }

      // Only the author or an admin can edit
      if (String(existing.authorId) !== userId) {
        return { success: false, message: BLOG_MESSAGES.FORBIDDEN };
      }

      const updates: Record<string, unknown> = {};
      if (input.title !== undefined) updates.title = input.title;
      if (input.slug !== undefined) updates.slug = input.slug;
      if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
      if (input.content !== undefined) updates.content = input.content;
      if (input.coverImage !== undefined) updates.coverImage = input.coverImage;
      if (input.tags !== undefined) updates.tags = input.tags;
      if (input.status !== undefined) {
        updates.status = input.status;
        if (input.status === "published" && existing.status !== "published") {
          updates.publishedAt = new Date();
        }
      }

      const updated = (await blogRepo.updateById(postId, { $set: updates })) as unknown as Record<
        string,
        unknown
      > | null;
      if (!updated) {
        return { success: false, message: BLOG_MESSAGES.UPDATE_ERROR };
      }

      return {
        success: true,
        message: BLOG_MESSAGES.UPDATED,
        data: toSummary(updated),
      };
    } catch {
      return { success: false, message: BLOG_MESSAGES.UPDATE_ERROR };
    }
  },

  /**
   * Soft-delete a blog post.
   */
  async delete(postId: string, userId: string): Promise<ApiResponse> {
    try {
      const existing = (await blogRepo.findById(postId)) as unknown as Record<
        string,
        unknown
      > | null;
      if (!existing || existing.isDeleted) {
        return { success: false, message: BLOG_MESSAGES.NOT_FOUND };
      }

      // Only the author or an admin can delete
      if (String(existing.authorId) !== userId) {
        return { success: false, message: BLOG_MESSAGES.FORBIDDEN };
      }

      await blogRepo.softDeleteById(postId, userId);
      return { success: true, message: BLOG_MESSAGES.DELETED };
    } catch {
      return { success: false, message: BLOG_MESSAGES.DELETE_ERROR };
    }
  },

  /**
   * Search published posts by text query.
   */
  async search(query: string, page = 1, pageSize = 10): Promise<ApiResponse<BlogPostSummary[]>> {
    try {
      const result = await blogRepo.searchPosts(query, { page, pageSize });
      return {
        success: true,
        message: BLOG_MESSAGES.FOUND,
        data: (result.data ?? []).map((p) => toSummary(p as unknown as Record<string, unknown>)),
        pagination: result.pagination,
      } as ApiResponse<BlogPostSummary[]>;
    } catch {
      return { success: false, message: BLOG_MESSAGES.GET_ERROR };
    }
  },

  /**
   * Get posts by author.
   */
  async getByAuthor(
    authorId: string,
    page = 1,
    pageSize = 10,
  ): Promise<ApiResponse<BlogPostSummary[]>> {
    try {
      const result = await blogRepo.findByAuthor(authorId, { page, pageSize });
      return {
        success: true,
        message: BLOG_MESSAGES.FOUND,
        data: (result.data ?? []).map((p) => toSummary(p as unknown as Record<string, unknown>)),
        pagination: result.pagination,
      } as ApiResponse<BlogPostSummary[]>;
    } catch {
      return { success: false, message: BLOG_MESSAGES.GET_ERROR };
    }
  },
};
