"use client";

/**
 * Upload hook — manages upload state.
 *
 * Provides a clean interface for components to initiate uploads
 * and track their progress, success, and error states.
 *
 * @example
 * ```tsx
 * const { upload, state, reset } = useUpload();
 *
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) await upload(file);
 * };
 * ```
 */

import { useState, useCallback } from "react";
import {
  INITIAL_UPLOAD_STATE,
  type IUploadResult,
  type UploadState,
} from "../types";
import { MESSAGES } from "@/constants/messages";
import { UPLOAD_MESSAGES } from "../constants";
import { validateFile } from "../utils/validation";

export interface UseUploadOptions {
  /** Max file size in bytes (default: 10 MB). */
  maxSize?: number;
  /** Allowed MIME types (default: common image types). */
  allowedTypes?: readonly string[];
  /** Callback fired on successful upload. */
  onSuccess?: (result: IUploadResult) => void;
  /** Callback fired on upload error. */
  onError?: (error: string) => void;
}

/**
 * Hook for managing file uploads with progress tracking.
 */
export function useUpload(options: UseUploadOptions = {}) {
  const [state, setState] = useState<UploadState>({ ...INITIAL_UPLOAD_STATE });

  const upload = useCallback(
    async (file: File) => {
      // Validate file locally before uploading
      const validation = validateFile(file, {
        allowedTypes: options.allowedTypes,
        maxSize: options.maxSize,
      });

      if (!validation.valid) {
        const error = validation.error ?? MESSAGES.ERROR.INVALID_FILE_TYPE;
        setState({
          status: "error",
          progress: 0,
          result: null,
          error,
        });
        options.onError?.(error);
        return;
      }

      setState({ status: "uploading", progress: 0, result: null, error: null });

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Use fetch with XHR-like progress (approximated)
        const response = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message =
            errorData?.message ?? UPLOAD_MESSAGES.UPLOAD_FAILED;
          setState({
            status: "error",
            progress: 100,
            result: null,
            error: message,
          });
          options.onError?.(message);
          return;
        }

        const data = await response.json();
        const result: IUploadResult = {
          url: data.data?.url ?? data.url,
          publicId: data.data?.publicId ?? data.publicId,
          format: data.data?.format ?? data.format,
          bytes: data.data?.bytes ?? data.bytes,
          width: data.data?.width ?? data.width,
          height: data.data?.height ?? data.height,
        };

        setState({
          status: "success",
          progress: 100,
          result,
          error: null,
        });

        options.onSuccess?.(result);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : MESSAGES.ERROR.NETWORK_ERROR;
        setState({
          status: "error",
          progress: 0,
          result: null,
          error: message,
        });
        options.onError?.(message);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setState({ ...INITIAL_UPLOAD_STATE });
  }, []);

  return {
    /** Upload state: status, progress, result, error. */
    state,
    /** Upload a file. */
    upload,
    /** Reset to initial state. */
    reset,
    /** Convenience booleans. */
    isUploading: state.status === "uploading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  };
}
