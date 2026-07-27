"use client";

import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { FileText } from "lucide-react";
import { BlogCard, BlogCardSkeleton } from "./blog-card";
import type { BlogPostSummary } from "../types";

interface BlogListProps {
  posts: BlogPostSummary[];
  isLoading?: boolean;
  href?: string;
  showStatus?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
}

/**
 * Blog post list component.
 *
 * Renders a responsive grid of blog cards, with loading and empty states.
 * Used in both the public blog page and the admin dashboard.
 *
 * @example
 * <BlogList
 *   posts={posts}
 *   isLoading={isLoading}
 *   href="/blog"
 *   emptyTitle="No posts yet"
 * />
 */
export function BlogList({
  posts,
  isLoading = false,
  href,
  showStatus = false,
  emptyTitle = "No posts found",
  emptyDescription,
  emptyAction,
  className,
}: BlogListProps) {
  if (isLoading) {
    return (
      <div
        className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}
        aria-label="Loading posts"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-8 w-8" />}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          href={href ? `${href}/${post.slug}` : undefined}
          showStatus={showStatus}
        />
      ))}
    </div>
  );
}
