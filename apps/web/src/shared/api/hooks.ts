import { log } from "@/lib/logger";
import type { InfiniteData, QueryFunctionContext, QueryKey, UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { ApiError, ApiResponse } from "@workly/types/common";

export type ApiInfiniteOptions<
  TData, // 실제 데이터 (ex. Pagination<Comment>)
  TSelected = InfiniteData<ApiResponse<TData>>, // select 결과 타입(기본: InfiniteData<ApiResponse<TData>>)
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = UseInfiniteQueryOptions<ApiResponse<TData>, ApiError, TSelected, TQueryKey, TPageParam>;

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

export function useApiInfiniteQuery<TData, TSelected = InfiniteData<ApiResponse<TData>>, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: ApiInfiniteOptions<TData, TSelected, TQueryKey, TPageParam>) {
  return useInfiniteQuery(options);
}

// 요청 훅
export function useApiMutation<TData, TVariables = unknown, TContext = unknown>(mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>, options?: Omit<UseMutationOptions<ApiResponse<TData>, ApiError, TVariables, TContext>, "mutationFn">) {
  return useMutation<ApiResponse<TData>, ApiError, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      log.debug("API mutation start", variables);
      return mutationFn(variables);
    },
    onSuccess: (data, variables, context, mutation) => {
      log.info("API mutation success", data);
      options?.onSuccess?.(data, variables, context, mutation);
    },
    onError: (error, variables, context, mutation) => {
      log.error("API mutation failed", error);
      options?.onError?.(error, variables, context, mutation);
    },

    onSettled: (data, error, variables, context, mutation) => {
      options?.onSettled?.(data, error, variables, context, mutation);
    },
    ...options,
  });
}
