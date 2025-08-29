export interface UploadResponse {
  success: boolean;
  fileKey: string;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

export interface UploadError {
  error: string;
}

export interface DeleteRequest {
  fileKey: string;
}

export interface DeleteResponse {
  success: boolean;
}

export interface PresignedUrlRequest {
  fileKey: string;
  action?: 'presigned' | 'redirect';
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
}

export interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[]; // MIME types
  folder?: string;
}