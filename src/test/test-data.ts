/**
 * Test data builders.
 *
 * Provides factory functions for creating realistic test data
 * used across unit, integration, and E2E tests.
 *
 * @example
 * import { buildUser, buildArticle } from "@/test/test-data";
 *
 * const user = buildUser();
 * const article = buildArticle({ authorId: user.id });
 */

// ─── User Data ──────────────────────────────────

export interface UserTestData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
  isEmailVerified: boolean;
  image: string | null;
  bio: string | null;
}

let userCounter = 0;

/**
 * Builds a test user with sensible defaults.
 * Each call generates a unique email to avoid collisions.
 */
export function buildUser(overrides: Partial<UserTestData> = {}): UserTestData {
  userCounter++;
  return {
    id: overrides.id ?? `user_${userCounter}`,
    name: overrides.name ?? `Test User ${userCounter}`,
    email: overrides.email ?? `test${userCounter}@example.com`,
    password: overrides.password ?? "TestPassword123!",
    role: overrides.role ?? "user",
    isEmailVerified: overrides.isEmailVerified ?? true,
    image: overrides.image ?? null,
    bio: overrides.bio ?? null,
  };
}

// ─── Admin User ─────────────────────────────────

/**
 * Builds a test admin user for admin-only route tests.
 */
export function buildAdmin(overrides: Partial<UserTestData> = {}): UserTestData {
  return buildUser({ ...overrides, role: "admin", name: "Admin User" });
}

// ─── Article Data ──────────────────────────────

export interface ArticleTestData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

let articleCounter = 0;

/**
 * Builds a test article with sensible defaults.
 */
export function buildArticle(overrides: Partial<ArticleTestData> = {}): ArticleTestData {
  articleCounter++;
  return {
    id: overrides.id ?? `article_${articleCounter}`,
    title: overrides.title ?? `Test Article ${articleCounter}`,
    slug: overrides.slug ?? `test-article-${articleCounter}`,
    content: overrides.content ?? `Content for test article ${articleCounter}.`,
    excerpt: overrides.excerpt ?? `Excerpt for article ${articleCounter}.`,
    authorId: overrides.authorId ?? "user_1",
    categoryId: overrides.categoryId ?? "category_1",
    tags: overrides.tags ?? ["test", "example"],
    published: overrides.published ?? true,
    createdAt: overrides.createdAt ?? new Date("2026-01-15"),
    updatedAt: overrides.updatedAt ?? new Date("2026-01-15"),
  };
}

// ─── Category Data ─────────────────────────────

export interface CategoryTestData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

let categoryCounter = 0;

/**
 * Builds a test category.
 */
export function buildCategory(overrides: Partial<CategoryTestData> = {}): CategoryTestData {
  categoryCounter++;
  return {
    id: overrides.id ?? `category_${categoryCounter}`,
    name: overrides.name ?? `Category ${categoryCounter}`,
    slug: overrides.slug ?? `category-${categoryCounter}`,
    description: overrides.description ?? null,
  };
}

// ─── Comment Data ─────────────────────────────

export interface CommentTestData {
  id: string;
  content: string;
  authorId: string;
  articleId: string;
  createdAt: Date;
}

let commentCounter = 0;

/**
 * Builds a test comment.
 */
export function buildComment(overrides: Partial<CommentTestData> = {}): CommentTestData {
  commentCounter++;
  return {
    id: overrides.id ?? `comment_${commentCounter}`,
    content: overrides.content ?? `Test comment ${commentCounter} content.`,
    authorId: overrides.authorId ?? "user_1",
    articleId: overrides.articleId ?? "article_1",
    createdAt: overrides.createdAt ?? new Date("2026-01-15"),
  };
}

// ─── Reset Counters ────────────────────────────

/**
 * Resets all test data counters.
 * Call in beforeEach if tests depend on predictable IDs.
 */
export function resetTestDataCounters(): void {
  userCounter = 0;
  articleCounter = 0;
  categoryCounter = 0;
  commentCounter = 0;
}
