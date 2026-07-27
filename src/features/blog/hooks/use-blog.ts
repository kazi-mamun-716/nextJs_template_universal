"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types/api";
import type { BlogPostSummary } from "../types";

export interface UseBlogPostsOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}

interface UseBlogPostsReturn {
  posts: BlogPostSummary[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  loadMore: () => void;
  reload: () => void;
}

/**
 * Helper that converts a createAction-based server action into a
 * callable function that accepts plain options instead of FormData.
 *
 * createAction produces `(prevState, formData) => Promise<ApiResponse>`.
 * This adapter lets the hook call it with a plain object.
 */
function createActionAdapter<T extends Record<string, unknown>>(
  action: (_prevState: ApiResponse | null, formData: FormData) => Promise<ApiResponse>,
) {
  return async (data: T): Promise<ApiResponse> => {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fd.append(key, String(value));
    }
    return action(null, fd);
  };
}

/**
 * Hook for fetching paginated blog posts on the client side.
 *
 * Accepts a raw createAction-based action (like getPublishedPosts)
 * and adapts it internally to accept plain JSON options.
 *
 * @example
 * const { posts, isLoading, loadMore } = useBlogPosts(getPublishedPosts);
 */
export function useBlogPosts(
  action: (_prevState: ApiResponse | null, formData: FormData) => Promise<ApiResponse>,
  options: UseBlogPostsOptions = {},
): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(options.page ?? 1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const wrappedAction = useCallback(createActionAdapter(action), [action]);

  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await wrappedAction({ ...options, page: pageNum });

        if (result.success && "pagination" in result) {
          const paginated = result as ApiResponse & {
            data?: BlogPostSummary[];
            pagination?: { totalPages: number; hasNext: boolean; hasPrevious: boolean };
          };
          setPosts((prev) =>
            append ? [...prev, ...(paginated.data ?? [])] : (paginated.data ?? []),
          );
          setTotalPages(paginated.pagination?.totalPages ?? 0);
          setHasNext(paginated.pagination?.hasNext ?? false);
          setHasPrevious(paginated.pagination?.hasPrevious ?? false);
          setHasMore(paginated.pagination?.hasNext ?? false);
        } else {
          setError(result.message);
        }
      } catch {
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [wrappedAction, options],
  );

  /**
   * Fetch on mount and when page changes.
   * Reload (page=1) replaces the list; loadMore (page+1) appends.
   */
  useEffect(() => {
    const isReload = page === 1;
    fetchPosts(page, !isReload);
  }, [page, fetchPosts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  const reload = useCallback(() => {
    setPage(1);
  }, []);

  return {
    posts,
    isLoading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrevious,
    loadMore,
    reload,
  };
}
