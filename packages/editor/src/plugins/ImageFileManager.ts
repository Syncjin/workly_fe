/**
 * 이미지 파일 관리 클래스
 * 
 * Editor 컴포넌트에서 이미지 파일 관련 로직을 분리합니다.
 */

import type { LexicalEditor } from "lexical";
import type {
  FileDeleteAdapter,
  FileUploadAdapter,
  ImageDiff,
  SubmitOptions,
  UploadStatus
} from "../types/upload";
import { walkNodes, type JSONNode } from "../utils/walkNodes";


export class ImageFileManager {
  private fileStore = new Map<string, File>();
  private initialImageState = new Map<string, string>();
  private isSubmitting = false;
  private uploadStatus: UploadStatus = {
    isUploading: false,
    uploadedCount: 0,
    totalCount: 0,
    errors: []
  };

  /**
   * 파일을 저장소에 저장
   */
  rememberFile(tempId: string, file: File): void {
    this.fileStore.set(tempId, file);
  }

  getFileByTempId(tempId: string): File | null {
    return this.fileStore.get(tempId) ?? null;
  }

  clearFileStore(): void {
    this.fileStore.clear();
  }

  getStatus(): {
    totalFiles: number;
    totalSize: number;
    files: Array<{ tempId: string; fileName: string; size: number }>;
  } {
    const files: Array<{ tempId: string; fileName: string; size: number }> = [];
    let totalSize = 0;

    this.fileStore.forEach((file, tempId) => {
      files.push({ tempId, fileName: file.name, size: file.size });
      totalSize += file.size;
    });
    return { totalFiles: files.length, totalSize, files };
  }

   /**
   * 초기 이미지 상태 주입, 조회
   */
  async setInitialImageState(initialJSON?: string): Promise<void> {
    if (!initialJSON) {
      this.initialImageState.clear();
      return;
    }

    const images = this.extractImagesFromJSON(initialJSON);
    const map = new Map<string, string>();
    images.forEach((img) => {
      if (img.fileId && img.src) map.set(img.fileId, img.src);
    });
    this.initialImageState = map;
  }

  getInitialImageState(): Map<string, string> {
    return new Map(this.initialImageState);
  }

  /**
   * 현재 업로드 상태 반환
  */
  getUploadStatus(): UploadStatus {
    return {
      ...this.uploadStatus,
      isUploading: this.uploadStatus.isUploading || this.isSubmitting
    };
  }

  /**
   * 현재 에디터 상태를 JSON으로 반환
   */
  getCurrentJSON(editor: LexicalEditor): string {
    const state = editor.getEditorState();
    return JSON.stringify(state.toJSON());
  }

  private getActiveTempIdsFromJSONRoot(root: JSONNode): Set<string> {
    const tempIds = new Set<string>();
    walkNodes(root, (n) => {
      if (n.type === "image" && typeof n.tempId === "string" && typeof n.src === "string") {
        if (n.src.startsWith("blob:")) tempIds.add(n.tempId);
      }
    });
    return tempIds;
  }

  cleanupUnusedFiles(editor: LexicalEditor): void {
    const json = editor.getEditorState().toJSON();
    const root = (json as any).root as JSONNode;
    const activeTempIds = this.getActiveTempIdsFromJSONRoot(root);

    const toDelete: string[] = [];
    this.fileStore.forEach((_file, tempId) => {
      if (!activeTempIds.has(tempId)) toDelete.push(tempId);
    });
    toDelete.forEach((id) => this.fileStore.delete(id));
  }

    /**
   * 업로드가 필요한 파일 목록 제공 - 실제 사용 중인 파일만 반환
   */
  getFilesToUpload(editor?: LexicalEditor): Array<{ tempId: string; file: File }> {
    if (editor) this.cleanupUnusedFiles(editor);
    const active = editor
      ? this.getActiveTempIdsFromJSONRoot((editor.getEditorState().toJSON() as any).root)
      : null;

    const list: Array<{ tempId: string; file: File }> = [];
    this.fileStore.forEach((file, tempId) => {
      if (!active || active.has(tempId)) list.push({ tempId, file });
    });
    return list;
  }

  hasUnsavedFiles(editor?: LexicalEditor): boolean {
    return this.getFilesToUpload(editor).length > 0;
  }

  /**
   * 이미지 추출해서 Imagenode json으로 치환
   */
   private extractImagesFromJSON(initialJSON: string): Array<{ fileId: string; src: string; tempId?: string }> {
    try {
      const parsed = JSON.parse(initialJSON);
      const root = parsed?.root as JSONNode;
      const arr: Array<{ fileId: string; src: string; tempId?: string }> = [];
      walkNodes(root, (n) => {
        if (n.type === "image" && typeof n.src === "string" && !n.src.startsWith("blob:") && n.fileId) {
          arr.push({ fileId: n.fileId, src: n.src, tempId: n.tempId || undefined });
        }
      });
      return arr;
    } catch {
      return [];
    }
  }

  private extractImagesFromCurrentState(editor: LexicalEditor): Array<{ fileId: string; src: string; tempId?: string }> {
    const current = editor.getEditorState().toJSON();
    const root = (current as any).root as JSONNode;
    const arr: Array<{ fileId: string; src: string; tempId?: string }> = [];
    walkNodes(root, (n) => {
      if (n.type !== "image" || typeof n.src !== "string") return;
      if (n.src.startsWith("blob:")) {
        // 새로 추가된 이미지
        const fid = typeof n.tempId === "string" ? n.tempId : n.src;
        arr.push({ fileId: fid, src: n.src, tempId: n.tempId });
      } else if (n.fileId) {
        // 기존 이미지
        arr.push({ fileId: n.fileId, src: n.src, tempId: n.tempId || undefined });
      }
    });
    return arr;
  }

  /**
   * image 추가,삭제된 다른점이 있는지 확인 계산
   */
  private calculateImageDiffInternal(
    editor: LexicalEditor,
    initialImageState: Map<string, string>
  ): ImageDiff {
    const currentImages = this.extractImagesFromCurrentState(editor);

    const toUpload: Array<{ tempId: string; file: File }> = [];
    const toDelete: Array<{ fileId: string; src: string }> = [];
    const unchanged: Array<{ fileId: string; src: string }> = [];

    const currentIds = new Set<string>();

    for (const img of currentImages) {
      if (img.src.startsWith("blob:") && img.tempId) {
        const f = this.getFileByTempId(img.tempId);
        if (f) toUpload.push({ tempId: img.tempId, file: f });
      } else {
        currentIds.add(img.fileId);
        unchanged.push({ fileId: img.fileId, src: img.src });
      }
    }

    initialImageState.forEach((src, fileId) => {
      if (!currentIds.has(fileId)) toDelete.push({ fileId, src });
    });

    return { toUpload, toDelete, unchanged };
  }
  
  async getImageDiff(editor: LexicalEditor): Promise<ImageDiff> {
    return this.calculateImageDiffInternal(editor, this.initialImageState);
  }

  private async processImageUploads(
    toUpload: Array<{ tempId: string; file: File }>,
    uploadAPI?: FileUploadAdapter
  ): Promise<{
    successCount: number;
    uploadResults: Map<string, { fileId: string; fileUrl: string }>;
    failedUploads: Array<{ tempId: string; file: File; error: Error }>;
    errors: Error[];
  }> {
    const uploadResults = new Map<string, { fileId: string; fileUrl: string }>();
    const failedUploads: Array<{ tempId: string; file: File; error: Error }> = [];
    const errors: Error[] = [];

    if (!uploadAPI || toUpload.length === 0) {
      return { successCount: 0, uploadResults, failedUploads, errors };
    }

    try {
      // 업로드 어댑터가 tempId까지 돌려주면 더 안전하지만,
      // 기존 계약: files[] -> same order 결과
      const files = toUpload.map((x) => x.file);
      const res = await uploadAPI(files);

      let successCount = 0;
      for (let i = 0; i < toUpload.length; i++) {
        const { tempId, file } = toUpload[i];
        const item = res[i];
        if (item?.fileId && item?.fileUrl) {
          uploadResults.set(tempId, { fileId: item.fileId, fileUrl: item.fileUrl });
          successCount++;
        } else {
          const e = new Error(`Invalid upload result for tempId=${tempId}`);
          failedUploads.push({ tempId, file, error: e });
          errors.push(e);
        }
      }
      return { successCount, uploadResults, failedUploads, errors };
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      toUpload.forEach(({ tempId, file }) => failedUploads.push({ tempId, file, error: e }));
      errors.push(e);
      return { successCount: 0, uploadResults, failedUploads, errors };
    }
  }

  private async processImageDeletions(
    toDelete: Array<{ fileId: string; src: string }>,
    deleteAPI?: FileDeleteAdapter
  ): Promise<{ successCount: number; failedDeletions: Array<{ fileId: string; src: string; error: Error }>; errors: Error[] }> {
    const failedDeletions: Array<{ fileId: string; src: string; error: Error }> = [];
    const errors: Error[] = [];
    if (!deleteAPI || toDelete.length === 0)
      return { successCount: 0, failedDeletions, errors };

    let successCount = 0;
    for (const it of toDelete) {
      try {
        await deleteAPI(it.fileId);
        successCount++;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        failedDeletions.push({ ...it, error: e });
        errors.push(e);
      }
    }
    return { successCount, failedDeletions, errors };
  }

   private replaceBlobWithUploadedInJSON(jsonString: string, uploadResults: Map<string, { fileId: string; fileUrl: string }>): string {
    const json = JSON.parse(jsonString);
    const root = json.root as JSONNode;
    let count = 0;

    walkNodes(root, (n) => {
      if (n.type === "image" && n.tempId && typeof n.tempId === "string") {
        const hit = uploadResults.get(n.tempId);
        if (hit) {
          n.src = hit.fileUrl;
          n.fileId = hit.fileId;
          n.tempId = null; // 제거
          count++;
        }
      }
    });

    return JSON.stringify(json);
  }

  async submit(
    editor: LexicalEditor,
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
    if (!editor) throw new Error("에디터가 초기화되지 않았습니다.");
    if (this.isSubmitting) throw new Error("이미 submit이 진행 중입니다.");

    const { compareWithInitial = true } = options || {};
    this.isSubmitting = true;
    this.uploadStatus = { isUploading: false, uploadedCount: 0, totalCount: 0, errors: [] };

    try {
      const imageDiff: ImageDiff = compareWithInitial
        ? this.calculateImageDiffInternal(editor, this.initialImageState)
        : { toUpload: this.getFilesToUpload(editor), toDelete: [], unchanged: [] };

      const totalOps = imageDiff.toUpload.length + imageDiff.toDelete.length;
      if (totalOps > 0 && (uploadAPI || deleteAPI)) {
        callbacks?.onUploadStart?.();
        this.uploadStatus = { ...this.uploadStatus, isUploading: true, totalCount: totalOps };
      }

      let done = 0;

      // 삭제
      if (imageDiff.toDelete.length > 0 && deleteAPI) {
        const del = await this.processImageDeletions(imageDiff.toDelete, deleteAPI);
        done += del.successCount;
        callbacks?.onUploadProgress?.({ uploaded: done, total: totalOps });
        this.uploadStatus = {
          ...this.uploadStatus,
          uploadedCount: done,
          errors: [...this.uploadStatus.errors, ...del.errors],
        };
      }

      // 업로드
      let uploadResults = new Map<string, { fileId: string; fileUrl: string }>();
      if (imageDiff.toUpload.length > 0 && uploadAPI) {
        const up = await this.processImageUploads(imageDiff.toUpload, uploadAPI);
        done += up.successCount;
        callbacks?.onUploadProgress?.({ uploaded: done, total: totalOps });
        this.uploadStatus = {
          ...this.uploadStatus,
          uploadedCount: done,
          errors: [...this.uploadStatus.errors, ...up.errors],
        };
        if (up.failedUploads.length > 0) {
          const e = new Error(`이미지 업로드 실패: ${up.failedUploads.length}개`);
          callbacks?.onUploadError?.(e);
          throw e;
        }
        uploadResults = up.uploadResults;
      }

      // 최종 JSON 생성 (치환 필요 시 교체)
      const currentJSON = this.getCurrentJSON(editor);
      let finalJSON = currentJSON;
      if (uploadResults.size > 0) {
        finalJSON = this.replaceBlobWithUploadedInJSON(currentJSON, uploadResults);
      }

      if (totalOps > 0 && (uploadAPI || deleteAPI)) callbacks?.onUploadComplete?.();
      return finalJSON;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.uploadStatus = { ...this.uploadStatus, isUploading: false, errors: [...this.uploadStatus.errors, e] };
      callbacks?.onUploadError?.(e);
      throw e;
    } finally {
      this.isSubmitting = false;
      this.uploadStatus = { ...this.uploadStatus, isUploading: false };
    }
  }
}