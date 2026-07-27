import * as React from "react";
import { cn } from "@/lib/utils";

const CardContext = React.createContext<{ hoverable?: boolean } | null>(null);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable hover elevation effect */
  hoverable?: boolean;
}

/**
 * Reusable Card component with compound sub-components.
 *
 * @example
 * <Card hoverable>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 */
export function Card({ className, hoverable, children, ...props }: CardProps) {
  return (
    <CardContext.Provider value={{ hoverable }}>
      <div
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          hoverable && "transition-shadow hover:shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
