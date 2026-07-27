"use client";

/**
 * Image upload component with drag & drop, preview, progress, and error states.
 *
 * Features:
 * - Drag & drop zone
 * - Click to browse
 * - Image preview before upload
 * - Upload progress indicator
 * - File validation (type, size)
 * - Error display
 * - Success callback
 *
 * @example
 * ```tsx
 * <ImageUpload
 *   folder="users/avatars"
 *   preset="avatar"
 *   onSuccess={(result) => console.log(result.url)}
 * />
 * ```
 */

import * as React from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUpload } from "../hooks/use-upload";
import { validateFile, formatFileSize } from "../utils/validation";
import { ACCEPTED_IMAGE_TYPES, UPLOAD_SIZE_LIMITS, UPLOAD_MESSAGES } from "../constants";
import type { IUploadResult } from "../types";

export interface ImageUploadProps {
  /** Max file size in bytes (default: 10 MB). */
  maxSize?: number;
  /** Allowed image MIME types. */
  allowedTypes?: readonly string[];
  /** Called with the upload result on success. */
  onSuccess?: (result: IUploadResult) => void;
  /** Called when upload fails. */
  onError?: (error: string) => void;
  /** Called when the user clears the selected file. */
  onClear?: () => void;
  /** Custom CSS class. */
  className?: string;
}

export function ImageUpload({
  maxSize = UPLOAD_SIZE_LIMITS.IMAGE,
  allowedTypes = ACCEPTED_IMAGE_TYPES,
  onSuccess,
  onError,
  onClear,
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const { state, upload, isUploading } = useUpload({
    maxSize,
    allowedTypes,
    onSuccess: (result) => {
      onSuccess?.(result);
    },
    onError: (error) => {
      setLocalError(error);
      onError?.(error);
    },
  });

  // Clean up object URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File | null) => {
    setLocalError(null);

    if (!file) {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      onClear?.();
      return;
    }

    // Validate file before showing preview
    const validation = validateFile(file, { allowedTypes, maxSize });
    if (!validation.valid) {
      setLocalError(validation.error ?? UPLOAD_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLocalError(null);
    await upload(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  };

  const showDropZone = !selectedFile && !isUploading && state.status !== "success";

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Drop zone */}
      {showDropZone && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50",
          )}
        >
          <div className="rounded-full bg-muted p-3">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{UPLOAD_MESSAGES.SELECT_IMAGE}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {UPLOAD_MESSAGES.DRAG_DROP}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {allowedTypes.map((t) => t.split("/")[1]).join(", ").toUpperCase()} &middot; Max{" "}
            {formatFileSize(maxSize)}
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Select image file"
      />

      {/* Local validation error */}
      {localError && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {/* Preview & actions */}
      {(selectedFile || state.result) && (
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
              {(state.result?.url ?? previewUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={state.result?.url ?? previewUrl ?? ""}
                  alt="Upload preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-medium">
                {state.result?.originalFilename ?? selectedFile?.name ?? "Image"}
              </p>
              {selectedFile && !state.result && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              )}
              {state.result && (
                <p className="text-xs text-muted-foreground">
                  {state.result.width}x{state.result.height} &middot;{" "}
                  {state.result.format.toUpperCase()} &middot;{" "}
                  {formatFileSize(state.result.bytes)}
                </p>
              )}
              {state.status === "success" && (
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {UPLOAD_MESSAGES.UPLOAD_SUCCESS}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {state.status === "success" || state.status === "error" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Upload button */}
          {selectedFile && !state.result && !isUploading && (
            <Button
              type="button"
              onClick={handleUpload}
              className="mt-3 w-full"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          )}

          {/* Progress */}
          {isUploading && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {UPLOAD_MESSAGES.PROCESSING}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
