import { log } from "@/lib/logger";
import { QueryFunctionContext, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions, useSuspenseQuery, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { api } from "./client";
import { ApiError, ApiResponse, createQueryKey } from "./types";

// GET 요청 훅
export function useApiQuery<T, TSelected = ApiResponse<T>>(queryKey: readonly unknown[], queryFn: (ctx: QueryFunctionContext) => Promise<ApiResponse<T>>, options?: Omit<UseQueryOptions<ApiResponse<T>, ApiError, TSelected>, "queryKey" | "queryFn">) {
  return useQuery<ApiResponse<T>, ApiError, TSelected>({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useApiSuspenseQuery<T, TSelected = ApiResponse<T>>(queryKey: readonly unknown[], queryFn: (ctx: QueryFunctionContext) => Promise<ApiResponse<T>>, options?: Omit<UseSuspenseQueryOptions<ApiResponse<T>, ApiError, TSelected>, "queryKey" | "queryFn">) {
  return useSuspenseQuery<ApiResponse<T>, ApiError, TSelected>({
    queryKey,
    queryFn,
    ...options,
  });
}

// POST 요청 훅
export function useApiMutation<T, TVariables = any>(endpoint: string, options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, TVariables>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      log.debug(`Creating data at: ${endpoint}`, variables);
      return api.post<T>(endpoint, variables);
    },
    onSuccess: (data, variables, context) => {
      log.info(`Successfully created data at: ${endpoint}`, data);
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      log.error(`Failed to create data at: ${endpoint}`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// PUT 요청 훅
export function useApiUpdate<T, TVariables = any>(endpoint: string, options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, TVariables>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      log.debug(`Updating data at: ${endpoint}`, variables);
      return api.put<T>(endpoint, variables);
    },
    onSuccess: (data, variables, context) => {
      log.info(`Successfully updated data at: ${endpoint}`, data);
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      log.error(`Failed to update data at: ${endpoint}`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// PATCH 요청 훅
export function useApiPatch<T, TVariables = any>(endpoint: string, options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, TVariables>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      log.debug(`Patching data at: ${endpoint}`, variables);
      return api.patch<T>(endpoint, variables);
    },
    onSuccess: (data, variables, context) => {
      log.info(`Successfully patched data at: ${endpoint}`, data);
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      log.error(`Failed to patch data at: ${endpoint}`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// DELETE 요청 훅
export function useApiDelete<T>(endpoint: string, options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, void>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, ApiError, void>({
    mutationFn: async () => {
      log.debug(`Deleting data at: ${endpoint}`);
      return api.delete<T>(endpoint);
    },
    onSuccess: (data, variables, context) => {
      log.info(`Successfully deleted data at: ${endpoint}`, data);
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      log.error(`Failed to delete data at: ${endpoint}`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// 파일 업로드 훅
export function useApiUpload<T>(endpoint: string, options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, File>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, ApiError, File>({
    mutationFn: async (file: File) => {
      log.debug(`Uploading file to: ${endpoint}`, { fileName: file.name, fileSize: file.size });
      return api.upload<T>(endpoint, file);
    },
    onSuccess: (data, variables, context) => {
      log.info(`Successfully uploaded file to: ${endpoint}`, data);
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      log.error(`Failed to upload file to: ${endpoint}`, error);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// 쿼리 키 팩토리 export
export { createQueryKey };
