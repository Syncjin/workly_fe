export interface FileInfoDTO {
  fileId: string; //파일 고유 ID (UUID)
  fileUrl: string; //S3 파일 접근 URL
  objectKey: string; //S3 버킷 내 객체 키(고유 키)
  originalFilename: string; //원본 파일명
  size: number; //파일 크기 (bytes)
  contentType: string; //파일 MIME 타입
  uploadedAt: string;
}

export interface FileDownloadDTO {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}
