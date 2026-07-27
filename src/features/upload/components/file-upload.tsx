"use client";

/**
 * Generic file upload component with drag & drop.
 *
 * Supports configurable MIME types, size limits, and multiple files.
 * Provides visual feedback for drag state, progress, and errors.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept=".pdf,.doc,.docx"
 *   maxSize={20 * 1024 * 1024}
 *   onFilesSelected={(files) => console.log(files)}
 * />
 * ```
 */

import * as React from "react";
import { Upload, File, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateFile, formatFileSize, isDocumentFile, isImageFile } from "../utils/validation";
import { ACCEPTED_DOCUMENT_TYPES, UPLOAD_SIZE_LIMITS } from "../constants";

export interface FileUploadProps {
  /** Comma-separated list of accepted file extensions/MIME types. */
  accept?: string;
  /** Max file size in bytes. */
  maxSize?: number;
  /** Allowed MIME types for validation. */
  allowedTypes?: readonly string[];
  /** Allow multiple files. */
  multiple?: boolean;
  /** Called when files are selected (before upload). */
  onFilesSelected?: (files: File[]) => void;
  /** Custom CSS class. */
  className?: string;
}

interface SelectedFile {
  file: File;
  id: string;
  preview?: string;
}

export function FileUpload({
  accept,
  maxSize = UPLOAD_SIZE_LIMITS.DOCUMENT,
  allowedTypes = ACCEPTED_DOCUMENT_TYPES,
  multiple = false,
  onFilesSelected,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<SelectedFile[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addFiles = (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const newFiles: SelectedFile[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validation = validateFile(file, { allowedTypes, maxSize });
      if (!validation.valid) {
        setError(validation.error ?? "Invalid file.");
        return;
      }

      const preview = isImageFile(file) ? URL.createObjectURL(file) : undefined;
      newFiles.push({
        file,
        id: `${file.name}-${file.size}-${file.lastModified}`,
        preview,
      });
    }

    const updated = multiple
      ? [...selectedFiles, ...newFiles]
      : newFiles;

    setSelectedFiles(updated);
    onFilesSelected?.(updated.map((f) => f.file));
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.id !== id);
    });
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50",
        )}
      >
        <div className="rounded-full bg-muted p-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Drag & drop{multiple ? " files" : " a file"} here, or click to browse
        </p>
        {accept && (
          <p className="text-xs text-muted-foreground">
            Accepted: {accept} &middot; Max {formatFileSize(maxSize)}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Select files"
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((sf) => (
            <div
              key={sf.id}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              {sf.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sf.preview}
                  alt={sf.file.name}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{sf.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(sf.file.size)}
                  {isDocumentFile(sf.file) && " · Document"}
                  {isImageFile(sf.file) && " · Image"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(sf.id)}
                aria-label={`Remove ${sf.file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
