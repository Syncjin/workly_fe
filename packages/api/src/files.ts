import type { ApiResponse } from "@workly/types/common";
import type { FileDeleteRequest, FileDownloadDTO, FileDownloadRequest, FileInfoDTO, FileRequest } from "@workly/types/domain";
import type { HttpClient } from "./http";

export function createFileApi(http: HttpClient) {
  return {
    deleteFiles: (params: FileDeleteRequest): Promise<ApiResponse<void>> => {
      return http.delete<void>(`/files/${params.fileId}`);
    },
    getFilesDownload: (params: FileDownloadRequest): Promise<ApiResponse<FileDownloadDTO>> => {
      return http.get<FileDownloadDTO>(`/files/${params.fileId}/download`);
    },
    postFilesUpload: (params: FileRequest): Promise<ApiResponse<FileInfoDTO[]>> => {
      const fd = new FormData();
      (params.files ?? []).forEach((f) => fd.append("files", f));
      return http.postMultipart<FileInfoDTO[]>(`/files/upload`, fd);
    },
  };
}
