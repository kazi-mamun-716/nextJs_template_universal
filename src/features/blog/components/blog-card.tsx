"use client";

import { Calendar, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPostSummary } from "../types";

interface BlogCardProps {
  post: BlogPostSummary;
  href?: string;
  showStatus?: boolean;
  className?: string;
}

/**
 * Blog card component for displaying a post summary.
 *
 * Used in both the public blog listing and the admin dashboard.
 * Shows title, excerpt, tags, author, and publication date.
 *
 * @example
 * <BlogCard post={post} href={`/blog/${post.slug}`} />
 */
export function BlogCard({ post, href, showStatus = false, className }: BlogCardProps) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const readingTime = Math.max(1, Math.ceil(post.excerpt.length / 1000));

  const CardWrapper = href ? "a" : "article";
  const wrapperProps = href ? { href } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className={cn(
        "group block rounded-lg border bg-card p-5 shadow-sm transition-all duration-200",
        "hover:border-muted-foreground/20 hover:shadow-md",
        href && "cursor-pointer",
        className,
      )}
    >
      {/* Status badge */}
      {showStatus && post.status !== "published" && (
        <span
          className={cn(
            "mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            post.status === "draft" &&
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            post.status === "archived" &&
              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
          )}
        >
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      )}

      {/* Title */}
      <h3
        className={cn(
          "mb-2 text-lg font-semibold leading-tight tracking-tight",
          "transition-colors duration-200 group-hover:text-primary",
        )}
      >
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {publishedDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {publishedDate}
          </span>
        )}

        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {readingTime} min read
        </span>

        {post.authorName && <span className="font-medium">{post.authorName}</span>}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              <Tag className="h-3 w-3" aria-hidden="true" />
              {tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="text-xs text-muted-foreground">+{post.tags.length - 4}</span>
          )}
        </div>
      )}
    </CardWrapper>
  );
}

/**
 * Loading skeleton for BlogCard.
 */
export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card p-5">
      <div className="mb-3 h-4 w-16 rounded bg-muted" />
      <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
      <div className="mb-4 space-y-1.5">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-3 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}
