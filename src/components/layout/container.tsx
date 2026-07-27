import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum width variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Whether to apply vertical padding */
  withPadding?: boolean;
}

const maxWidths = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1600px]",
  full: "max-w-full",
};

/**
 * Responsive container with configurable max-width.
 * Centers content and applies horizontal padding.
 *
 * @example
 * <Container size="sm">Narrow content</Container>
 * <Container size="xl">Wide content</Container>
 * <Container withPadding>With vertical spacing</Container>
 */
export function Container({ children, className, size = "lg", withPadding = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidths[size],
        withPadding && "py-6 sm:py-8 lg:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
