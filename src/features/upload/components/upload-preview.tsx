"use client";

/**
 * Upload preview component.
 *
 * Displays an uploaded image with its metadata and a delete button.
 * Used after a successful upload to show the result and allow cleanup.
 *
 * @example
 * ```tsx
 * <UploadPreview
 *   url="https://res.cloudinary.com/..."
 *   publicId="users/avatars/abc123"
 *   width={200}
 *   height={200}
 *   format="webp"
 *   bytes={10240}
 *   onDelete={(publicId) => handleDelete(publicId)}
 * />
 * ```
 */

import * as React from "react";
import Image from "next/image";
import { Trash2, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "../utils/validation";

export interface UploadPreviewProps {
  /** Cloudinary secure URL. */
  url: string;
  /** Cloudinary public ID. */
  publicId: string;
  /** Image width in pixels. */
  width?: number;
  /** Image height in pixels. */
  height?: number;
  /** File format (e.g. "webp", "jpg"). */
  format?: string;
  /** File size in bytes. */
  bytes?: number;
  /** Called when the user clicks delete. */
  onDelete?: (publicId: string) => void;
  /** Custom CSS class. */
  className?: string;
  /** Whether the delete operation is in progress. */
  isDeleting?: boolean;
}

export function UploadPreview({
  url,
  publicId,
  width,
  height,
  format,
  bytes,
  onDelete,
  className,
  isDeleting = false,
}: UploadPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      {/* Image */}
      <div className="relative aspect-video w-full bg-muted">
        <Image
          src={url}
          alt={`Uploaded ${format?.toUpperCase() ?? "image"}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Metadata */}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-tight">
            {publicId.split("/").pop() ?? "Untitled"}
          </p>
          <span className="text-xs text-muted-foreground">
            {format?.toUpperCase() ?? "N/A"}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {width && height && (
            <span>
              {width} × {height}
            </span>
          )}
          {bytes !== undefined && <span>{formatFileSize(bytes)}</span>}
          <span className="truncate max-w-[200px]" title={publicId}>
            ID: {publicId}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy URL
              </>
            )}
          </Button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground h-8"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>

          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(publicId)}
              isLoading={isDeleting}
              className="ml-auto gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
