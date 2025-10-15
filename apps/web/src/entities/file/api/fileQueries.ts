/**
 * 파일 React Query 훅
 *
 */

import { fileApi } from "@/entities/file/api/fileApi";
import { FileDownload, FileInfo } from "@/entities/file/model";
import { fileQueryKeys } from "@/entities/file/model/keys";
import { useApiMutation, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { UseQueryOptions } from "@tanstack/react-query";
import { FileDeleteRequest, FileDownloadRequest, FileRequest } from "@workly/types";
import type { ApiError, ApiResponse } from "@workly/types/common";

export const useFileUpload = () => {
  return useApiMutation<FileInfo[], FileRequest>((params) => fileApi.postFilesUpload(params), {});
};

export const useFileDelete = () => {
  return useApiMutation<void, FileDeleteRequest>((params) => fileApi.deleteFiles(params), {});
};

export const useFileDownload = <TSelected = ApiResponse<FileDownload>>(params: FileDownloadRequest, options?: Omit<UseQueryOptions<ApiResponse<FileDownload>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = fileQueryKeys.detail(params.fileId);

  return useApiSuspenseQuery<FileDownload, TSelected>(queryKey, () => fileApi.getFilesDownload(params), {
    ...options,
  });
};
