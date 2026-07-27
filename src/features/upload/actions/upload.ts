"use server";

import type { ApiResponse } from "@/types/api";

/**
 * Uploads a file to Cloudinary and returns the URL.
 */
export async function upload(formData: FormData): Promise<ApiResponse<{ url: string }>> {
  // TODO: Implement Cloudinary upload
  return { success: false, message: "Not implemented" };
}
