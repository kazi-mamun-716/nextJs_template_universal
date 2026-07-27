import { NextRequest } from "next/server";
import {
  withAuth,
  withErrorHandling,
  type AuthContext,
} from "@/lib/api/handler";
import { ok, badRequest } from "@/lib/api/response";
import { avatarFileSchema } from "@/features/upload/schemas/upload-schema";
import { cloudinaryService } from "@/features/upload/services/cloudinary-service";
import { UPLOAD_FOLDERS } from "@/features/upload/constants";

/**
 * POST /api/upload/avatar
 *
 * Uploads a user avatar image to Cloudinary.
 * Requires authentication.
 * Accepts multipart/form-data with a "file" field.
 *
 * @returns { url, publicId, width, height }
 */
export const POST = withErrorHandling(
  withAuth(async (request: NextRequest, context: AuthContext) => {
    const { user } = context;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return badRequest("No file provided.");
    }

    // Validate the file
    const validation = avatarFileSchema.safeParse(file);
    if (!validation.success) {
      return badRequest("Invalid file.");
    }

    // Upload to Cloudinary
    const result = await cloudinaryService.uploadFileObject(file, {
      folder: UPLOAD_FOLDERS.AVATARS,
      preset: "avatar",
      invalidate: true,
      overwrite: true,
    });

    return ok({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  }),
);
