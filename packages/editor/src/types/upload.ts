export interface UploadedFileInfo {
  fileId: string; // 파일 고유 ID
  fileUrl: string; // 접근 가능한 파일 URL
}

/**
 * 파일 업로드 어댑터 함수 타입
 * 사용하는 쪽에서 다양한 API 응답을 UploadedFileInfo[]로 변환해서 전달
 *
 * @example
 * // React Query 사용 예시
 * const uploadAdapter: FileUploadAdapter = async (files) => {
 *   const result = await fileUploadMutation.mutateAsync({ files });
 *   return result.data.map(item => ({
 *     fileId: item.fileId,
 *     fileUrl: item.fileUrl
 *   }));
 * };
 *
 */
export type FileUploadAdapter = (files: File[]) => Promise<UploadedFileInfo[]>;

/**
 * 파일 삭제 어댑터 함수 타입
 * 사용하는 쪽에서 다양한 API를 호출하고 성공/실패만 반환
 *
 * @example
 * // React Query 사용 예시
 * const deleteAdapter: FileDeleteAdapter = async (fileId) => {
 *   await fileDeleteMutation.mutateAsync(fileId);
 * };
 *
 */
export type FileDeleteAdapter = (fileId: string) => Promise<void>;

/**
 * 업로드 상태 정보
 */
export interface UploadStatus {
  isUploading: boolean;
  uploadedCount: number;
  totalCount: number;
  errors: Error[];
}

/**
 * 업로드 설정
 */
export interface UploadConfig {
  maxRetries: number; // 재시도 횟수 (기본: 3)
  retryDelayMs: number; // 재시도 지연 시간 (기본: 1000ms)
}

/**
 * 이미지 변경사항 정보
 */
export interface ImageDiff {
  toUpload: Array<{ tempId: string; file: File }>; // 새로 추가된 이미지
  toDelete: Array<{ fileId: string; src: string }>; // 삭제된 이미지 (fileId 포함)
  unchanged: Array<{ fileId: string; src: string }>; // 변경되지 않은 이미지
}

/**
 * submit 메서드 옵션
 */
export interface SubmitOptions {
  compareWithInitial?: boolean; // 초기 상태와 비교할지 여부 (기본: true)
}
