import type { LexicalEditor } from "lexical";
import type { FileDeleteAdapter, FileUploadAdapter, ImageDiff, SubmitOptions, UploadStatus } from "../types/upload";
import { walkNodes } from "../utils/walkNodes";

type ImageData = { fileId: string; src: string; tempId?: string; width?: number; height?: number };

export class ImageFileManager {
  private editor: LexicalEditor | null = null;
  private fileStore = new Map<string, File>();
  private initialImageState = new Map<string, { src: string; width?: number; height?: number }>();
  private isSubmitting = false;
  private uploadStatus: UploadStatus = { isUploading: false, uploadedCount: 0, totalCount: 0, errors: [] };

  // 기본 메서드들
  attach(editor: LexicalEditor) {
    if (this.editor !== editor) {
      this.editor = editor;
    }
  }

  detach() {
    this.editor = null;
  }

  rememberFile(tempId: string, file: File): void {
    this.fileStore.set(tempId, file);
  }

  getFileByTempId(tempId: string): File | null {
    return this.fileStore.get(tempId) ?? null;
  }

  resetState(): void {
    this.fileStore.clear();
    this.initialImageState.clear();
  }

  clearFileStore(): void {
    this.fileStore.clear();
  }

  cleanupUnusedFiles(): void {
    if (!this.editor) return;

    const currentImages = this.extractImages(this.getCurrentJSON());
    const activeTempIds = new Set<string>();

    // 현재 사용 중인 tempId 수집
    currentImages.forEach((img) => {
      if (img.src.startsWith("blob:") && img.tempId) {
        activeTempIds.add(img.tempId);
      }
    });

    // 사용하지 않는 파일 제거
    const toDelete: string[] = [];
    this.fileStore.forEach((_, tempId) => {
      if (!activeTempIds.has(tempId)) {
        toDelete.push(tempId);
      }
    });

    toDelete.forEach((tempId) => this.fileStore.delete(tempId));
  }

  getCurrentJSON(): string {
    if (!this.editor) throw new Error("Editor not attached");
    return JSON.stringify(this.editor.getEditorState().toJSON());
  }

  getUploadStatus(): UploadStatus {
    return { ...this.uploadStatus, isUploading: this.uploadStatus.isUploading || this.isSubmitting };
  }

  hasUnsavedFiles(): boolean {
    return this.getFilesToUpload().length > 0;
  }

  // 초기 상태 설정
  async setInitialImageState(initialJSON?: string): Promise<void> {
    this.initialImageState.clear();
    if (!initialJSON) return;

    const images = this.extractImages(initialJSON);
    images.forEach((img) => {
      if (img.fileId && img.src) {
        this.initialImageState.set(img.fileId, { src: img.src, width: img.width, height: img.height });
      }
    });
  }

  // 이미지 추출 (통합)
  private extractImages(jsonString: string): ImageData[] {
    try {
      const json = JSON.parse(jsonString);
      const images: ImageData[] = [];

      walkNodes(json.root, (n) => {
        if (n.type !== "image" || typeof n.src !== "string") return;

        if (n.src.startsWith("blob:")) {
          // 새 이미지
          const fid = typeof n.tempId === "string" ? n.tempId : n.src;
          images.push({
            fileId: fid,
            src: n.src,
            tempId: n.tempId,
            width: n.width > 0 ? n.width : undefined,
            height: n.height > 0 ? n.height : undefined,
          });
        } else if (n.fileId) {
          // 기존 이미지
          images.push({
            fileId: n.fileId,
            src: n.src,
            tempId: n.tempId || undefined,
            width: n.width > 0 ? n.width : undefined,
            height: n.height > 0 ? n.height : undefined,
          });
        } else {
          // fileId 복구 시도
          const fileId = this.extractFileIdFromSrc(n.src);
          if (fileId) {
            images.push({
              fileId,
              src: n.src,
              tempId: n.tempId || undefined,
              width: n.width > 0 ? n.width : undefined,
              height: n.height > 0 ? n.height : undefined,
            });
          }
        }
      });

      return images;
    } catch {
      return [];
    }
  }

  private extractFileIdFromSrc(src: string): string | null {
    const match = src.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    return match ? match[1] : null;
  }

  // 업로드할 파일 목록
  getFilesToUpload(): Array<{ tempId: string; file: File }> {
    if (!this.editor) return [];

    const currentImages = this.extractImages(this.getCurrentJSON());
    const result: Array<{ tempId: string; file: File }> = [];

    currentImages.forEach((img) => {
      if (img.src.startsWith("blob:") && img.tempId) {
        const file = this.getFileByTempId(img.tempId);
        if (file) result.push({ tempId: img.tempId, file });
      }
    });

    return result;
  }

  // 이미지 차이 계산
  async getImageDiff(): Promise<ImageDiff> {
    const currentImages = this.extractImages(this.getCurrentJSON());
    const currentIds = new Set<string>();

    const toUpload: Array<{ tempId: string; file: File }> = [];
    const toDelete: Array<{ fileId: string; src: string }> = [];
    const unchanged: Array<{ fileId: string; src: string; width?: number; height?: number }> = [];

    // 현재 이미지 처리
    currentImages.forEach((img) => {
      if (img.src.startsWith("blob:") && img.tempId) {
        const file = this.getFileByTempId(img.tempId);
        if (file) toUpload.push({ tempId: img.tempId, file });
      } else if (img.fileId) {
        currentIds.add(img.fileId);
        unchanged.push({ fileId: img.fileId, src: img.src, width: img.width, height: img.height });
      }
    });

    // 삭제된 이미지 찾기
    this.initialImageState.forEach((data, fileId) => {
      if (!currentIds.has(fileId)) {
        toDelete.push({ fileId, src: data.src });
      }
    });

    return { toUpload, toDelete, unchanged };
  }

  // 메인 submit 메서드
  async submit(
    uploadAPI?: FileUploadAdapter,
    deleteAPI?: FileDeleteAdapter,
    options?: SubmitOptions,
    callbacks?: {
      onUploadStart?: () => void;
      onUploadProgress?: (progress: { uploaded: number; total: number }) => void;
      onUploadComplete?: () => void;
      onUploadError?: (error: Error) => void;
    }
  ): Promise<string> {
    if (this.isSubmitting) throw new Error("Already submitting");

    this.isSubmitting = true;
    this.uploadStatus = { isUploading: false, uploadedCount: 0, totalCount: 0, errors: [] };

    try {
      const { compareWithInitial = true } = options || {};
      const imageDiff = compareWithInitial ? await this.getImageDiff() : { toUpload: this.getFilesToUpload(), toDelete: [], unchanged: [] };

      const totalOps = imageDiff.toUpload.length + imageDiff.toDelete.length;
      if (totalOps > 0) {
        callbacks?.onUploadStart?.();
        this.uploadStatus.isUploading = true;
        this.uploadStatus.totalCount = totalOps;
      }

      let done = 0;

      // 삭제 처리
      if (imageDiff.toDelete.length > 0 && deleteAPI) {
        for (const item of imageDiff.toDelete) {
          try {
            await deleteAPI(item.fileId);
            done++;
          } catch (err) {
            this.uploadStatus.errors.push(err instanceof Error ? err : new Error(String(err)));
          }
        }
        callbacks?.onUploadProgress?.({ uploaded: done, total: totalOps });
      }

      // 업로드 처리
      const uploadResults = new Map<string, { fileId: string; fileUrl: string }>();
      if (imageDiff.toUpload.length > 0 && uploadAPI) {
        try {
          const files = imageDiff.toUpload.map((x) => x.file);
          const results = await uploadAPI(files);

          imageDiff.toUpload.forEach(({ tempId }, i) => {
            const result = results[i];
            if (result?.fileId && result?.fileUrl) {
              uploadResults.set(tempId, { fileId: result.fileId, fileUrl: result.fileUrl });
              done++;
            }
          });
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          this.uploadStatus.errors.push(error);
          callbacks?.onUploadError?.(error);
          throw error;
        }
        callbacks?.onUploadProgress?.({ uploaded: done, total: totalOps });
      }

      // JSON 생성 및 변환
      let finalJSON = this.getCurrentJSON();
      if (uploadResults.size > 0) {
        const json = JSON.parse(finalJSON);
        walkNodes(json.root, (n) => {
          if (n.type === "image" && n.tempId && typeof n.tempId === "string") {
            const result = uploadResults.get(n.tempId);
            if (result) {
              n.src = result.fileUrl;
              n.fileId = result.fileId;
              n.tempId = null;
            }
          }
        });
        finalJSON = JSON.stringify(json);
      }

      if (totalOps > 0) callbacks?.onUploadComplete?.();
      return finalJSON;
    } finally {
      this.isSubmitting = false;
      this.uploadStatus.isUploading = false;
    }
  }
}
