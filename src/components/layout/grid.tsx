import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
}

/**
 * Responsive CSS grid layout component.
 */
export function Grid({ children, className, cols = 3 }: GridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        {
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": cols === 3,
          "grid-cols-1 sm:grid-cols-2": cols === 2,
          "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4": cols === 4,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
