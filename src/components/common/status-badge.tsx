import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "archived";
  className?: string;
}

/**
 * Displays a colored badge indicating status.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100": status === "active",
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100": status === "inactive",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100": status === "pending",
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100": status === "archived",
        },
        className,
      )}
    >
      {status}
    </span>
  );
}
