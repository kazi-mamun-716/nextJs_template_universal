"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image URL for the avatar */
  src?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Name used to generate initials fallback */
  name?: string;
  /** Avatar size */
  size?: "sm" | "md" | "lg" | "xl";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Reusable Avatar component with image support and initials fallback.
 *
 * @example
 * <Avatar src="/profile.jpg" name="John Doe" />
 * <Avatar name="Jane Smith" size="lg" />
 * <Avatar />
 */
export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  // Reset error state when src changes
  React.useEffect(() => {
    setImageError(false);
  }, [src]);

  const showImage = src && !imageError;

  const sizeClasses: Record<string, string> = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const dimensionMap: Record<string, number> = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted",
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
      {...props}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt ?? name ?? "Avatar"}
          width={dimensionMap[size] ?? dimensionMap.md}
          height={dimensionMap[size] ?? dimensionMap.md}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : name ? (
        <span className="font-medium text-muted-foreground">
          {getInitials(name)}
        </span>
      ) : (
        <User className="h-1/2 w-1/2 text-muted-foreground" />
      )}
    </div>
  );
}
Avatar.displayName = "Avatar";
