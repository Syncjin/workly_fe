import { boardApi } from "@/entities/board/api/boardApi";
import type { Board, BoardDetailParams, BoardParams } from "@/entities/board/model";
import { useApiQuery, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { UseQueryOptions, UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { ApiError, ApiResponse } from "@workly/types/common";
import { boardQueryKeys } from "../model";

/**
 * 게시판 목록을 가져오는 React Query 훅
 */

export const useBoardList = <TSelected = ApiResponse<Board[]>>(params?: BoardParams, options?: Omit<UseQueryOptions<ApiResponse<Board[]>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = boardQueryKeys.list(params);

  return useApiQuery<Board[], TSelected>(queryKey, () => boardApi.getBoards(params), {
    ...options,
  });
};

export const useBoardListSuspense = <TSelected = ApiResponse<Board[]>>(params?: BoardParams, options?: Omit<UseSuspenseQueryOptions<ApiResponse<Board[]>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = boardQueryKeys.list(params);
  return useApiSuspenseQuery<Board[], TSelected>(queryKey, () => boardApi.getBoards(params), {
    ...options,
  });
};

export const useBoardDetail = <TSelected = ApiResponse<Board>>(params: BoardDetailParams, options?: Omit<UseQueryOptions<ApiResponse<Board>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = boardQueryKeys.detail(params?.boardId);

  return useApiQuery<Board, TSelected>(queryKey, () => boardApi.getBoardById(params), {
    ...options,
  });
};

export const useBoardDetailSuspense = <TSelected = ApiResponse<Board>>(params: BoardDetailParams, options?: Omit<UseSuspenseQueryOptions<ApiResponse<Board>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = boardQueryKeys.detail(params?.boardId);

  return useApiSuspenseQuery<Board, TSelected>(queryKey, () => boardApi.getBoardById(params), {
    ...options,
  });
};
