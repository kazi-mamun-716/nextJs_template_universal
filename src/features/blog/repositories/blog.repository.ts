/**
 * Blog post repository.
 *
 * Extends BaseRepository to inherit standard CRUD operations.
 * Adds blog-specific query methods: findBySlug, findPublished, search.
 */
import { BaseRepository, type PaginationQuery, type FindOptions } from "@/lib/db";
import { BlogPostModel, type IBlogPostDocument } from "../models/blog.model";

/** Filter query type for blog posts. */
export interface BlogFilter {
  status?: string;
  authorId?: string;
  tags?: string[];
  search?: string;
}

export class BlogRepository extends BaseRepository<IBlogPostDocument> {
  constructor() {
    super(BlogPostModel);
  }

  /**
   * Find a published post by its slug.
   *
   * @param slug - URL-friendly slug
   * @param options - Query options (select, populate)
   * @returns The post or null
   */
  async findBySlug(slug: string, options: FindOptions = {}): Promise<IBlogPostDocument | null> {
    return this.findOne({ slug, status: "published", isDeleted: false }, options);
  }

  /**
   * Find published posts with pagination (most recent first).
   * Excludes soft-deleted and non-published posts.
   *
   * @param pagination - Pagination and sorting params
   * @param options - Query options
   */
  async findPublished(pagination: PaginationQuery = {}, options: FindOptions = {}) {
    return this.findPaginated(
      { status: "published", isDeleted: false },
      { sortBy: "publishedAt", sortOrder: "desc", ...pagination },
      options,
    );
  }

  /**
   * Find posts by author with pagination.
   *
   * @param authorId - The author's user ID
   * @param pagination - Pagination and sorting params
   */
  async findByAuthor(authorId: string, pagination: PaginationQuery = {}) {
    return this.findPaginated(
      { authorId, isDeleted: false },
      { sortBy: "createdAt", sortOrder: "desc", ...pagination },
    );
  }

  /**
   * Full-text search across published posts.
   *
   * @param query - Search term
   * @param pagination - Pagination params
   */
  async searchPosts(query: string, pagination: PaginationQuery = {}) {
    return this.findPaginated(
      {
        status: "published",
        isDeleted: false,
        $text: { $search: query },
      },
      { sortBy: "publishedAt", sortOrder: "desc", ...pagination },
    );
  }

  /**
   * Find all posts by filter (for admin dashboard — includes drafts).
   *
   * @param filter - Blog filter options
   * @param pagination - Pagination params
   */
  async findAllByFilter(filter: BlogFilter, pagination: PaginationQuery = {}) {
    const mongoFilter: Record<string, unknown> = { isDeleted: false };

    if (filter.status) mongoFilter.status = filter.status;
    if (filter.authorId) mongoFilter.authorId = filter.authorId;
    if (filter.tags && filter.tags.length > 0) {
      mongoFilter.tags = { $in: filter.tags };
    }
    if (filter.search) {
      mongoFilter.$text = { $search: filter.search };
    }

    return this.findPaginated(mongoFilter, pagination);
  }

  /**
   * Get total published post count.
   */
  async countPublished(): Promise<number> {
    return this.count({ status: "published", isDeleted: false });
  }
}
