import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  /** Icon to display (overrides the default Inbox icon) */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Optional action button rendered below the description */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Empty state display with icon, title, description, and optional action.
 *
 * @example
 * <EmptyState
 *   title="No results found"
 *   description="Try adjusting your search or filters."
 *   action={<Button>Create new</Button>}
 * />
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
