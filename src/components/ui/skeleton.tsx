import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Predefined skeleton shape */
  variant?: "text" | "circular" | "rectangular" | "card";
}

/**
 * Reusable Skeleton loading component with shape variants.
 *
 * @example
 * <Skeleton className="h-4 w-[250px]" />              // text line
 * <Skeleton variant="circular" className="h-10 w-10" />  // avatar
 * <Skeleton variant="card" className="h-48 w-full" />     // card placeholder
 */
export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "circular" && "rounded-full",
        variant === "card" && "rounded-lg",
        variant === "rectangular" && "rounded-md",
        variant === "text" && "h-4 rounded",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A complete card skeleton with image, title, and description placeholders.
 *
 * @example
 * <SkeletonCard />
 */
export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Skeleton variant="rectangular" className="h-32 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/**
 * A profile/avatar skeleton with avatar circle, name, and email lines.
 *
 * @example
 * <SkeletonProfile />
 */
export function SkeletonProfile() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" className="h-10 w-10" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/**
 * A table row skeleton for loading states in tables.
 *
 * @example
 * <SkeletonTableRow />
 */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === 0 ? "w-1/4" : "w-1/6")}
        />
      ))}
    </div>
  );
}
