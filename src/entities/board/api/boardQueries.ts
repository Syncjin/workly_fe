import type { Board } from "@/entities/board/model/types";
import { useApiQuery, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { ApiError, ApiResponse } from "@/shared/api/types";
import type { UseQueryOptions, UseQueryResult, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { boardQueryKeys } from "../model";

/**
 * 게시판 목록을 가져오는 React Query 훅
 */

export const useBoardList = <TSelected = ApiResponse<Board[]>>(options?: Omit<UseQueryOptions<ApiResponse<Board[]>, ApiError, TSelected>, "queryKey" | "queryFn">): UseQueryResult<TSelected, ApiError> => {
  const queryKey = boardQueryKeys.list();

  return useApiQuery<Board[], TSelected>(queryKey, "/boards", {
    ...options,
  });
};

export const useBoardListSuspense = <TSelected = ApiResponse<Board[]>>(options?: Omit<UseSuspenseQueryOptions<ApiResponse<Board[]>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = boardQueryKeys.list();
  return useApiSuspenseQuery<Board[], TSelected>(queryKey, "/boards", {
    ...options,
  });
};
