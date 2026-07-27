"use server";

/**
 * Upload server action.
 *
 * Validates the uploaded file, uploads it to Cloudinary, and returns
 * the result. Uses `createAction` from the API layer for consistent
 * error handling and validation.
 *
 * @example
 * ```tsx
 * // In a client component:
 * <form action={upload}>
 *   <input type="file" name="file" />
 * </form>
 * ```
 */

import { createAction } from "@/lib/api";
import { imageFileSchema } from "../schemas/upload-schema";
import { cloudinaryService } from "../services/cloudinary-service";
import { UPLOAD_MESSAGES } from "../constants";

export const upload = createAction({
  schema: imageFileSchema,
  requireAuth: true,
  handler: async (file, { userId }) => {
    const result = await cloudinaryService.uploadFileObject(file, {
      folder: `uploads/users/${userId}`,
      optimize: true,
    });

    return {
      success: true,
      message: UPLOAD_MESSAGES.UPLOAD_SUCCESS,
      data: result,
    };
  },
});
