import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Error state display with message and retry button.
 */
export function ErrorState({ title, message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <h3 className="text-lg font-semibold text-destructive">{title ?? "Something went wrong"}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-sm font-medium text-primary hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
