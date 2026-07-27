"use client";

import { useState, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "@/providers/toast-provider";
import { usersFeatureConfig } from "@/features/users/config";

/**
 * User avatar component with upload capability.
 * Shows the user's image, falls back to initials or a default icon.
 * Clicking the camera button triggers file selection for upload.
 */
export function UserAvatar({
  name,
  image,
  size = "lg",
  onUpdate,
}: {
  /** User's display name (for initials fallback). */
  name?: string | null;
  /** User's avatar image URL. */
  image?: string | null;
  /** Avatar size variant. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Callback when avatar is successfully updated. */
  onUpdate?: (imageUrl: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > usersFeatureConfig.avatar.maxFileSize) {
      toast.error("Image exceeds maximum file size of 2MB");
      return;
    }

    if (!usersFeatureConfig.avatar.allowedFormats.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        onUpdate?.(result.data.url);
        toast.success("Avatar updated successfully");
      } else {
        toast.error(result.message ?? "Failed to upload avatar");
      }
    } catch {
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative inline-flex">
      <Avatar
        src={image}
        name={name ?? undefined}
        size={size}
        className="ring-2 ring-background"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
        aria-label="Upload avatar"
      >
        {isUploading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
        aria-hidden="true"
      />
    </div>
  );
}
