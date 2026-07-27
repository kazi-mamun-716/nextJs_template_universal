/**
 * Upload feature type definitions.
 */
export interface IUploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export interface IUploadError {
  code: string;
  message: string;
}
