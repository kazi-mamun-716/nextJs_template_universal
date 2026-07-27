"use server";

/**
 * Delete server action.
 *
 * Deletes a file from Cloudinary by its URL.
 * Extracts the public ID automatically and destroys the asset.
 *
 * @example
 * ```tsx
 * const result = await deleteFile({ url: "https://res.cloudinary.com/..." });
 * ```
 */

import { z } from "zod";
import { createAction } from "@/lib/api";
import { cloudinaryService } from "../services/cloudinary-service";
import { UPLOAD_MESSAGES } from "../constants";
import { MESSAGES } from "@/constants/messages";

const deleteSchema = z.object({
  url: z.string().url("Invalid Cloudinary URL."),
});

export const deleteFile = createAction({
  schema: deleteSchema,
  requireAuth: true,
  handler: async (data) => {
    // Extract public ID from URL
    const publicId = cloudinaryService.getPublicId(data.url);
    if (!publicId) {
      return {
        success: false,
        message: "Could not extract file identifier from the provided URL.",
      };
    }

    const deleted = await cloudinaryService.deleteFile(publicId);
    if (!deleted) {
      return {
        success: false,
        message: UPLOAD_MESSAGES.DELETE_FAILED,
      };
    }

    return {
      success: true,
      message: UPLOAD_MESSAGES.DELETE_SUCCESS,
    };
  },
});
