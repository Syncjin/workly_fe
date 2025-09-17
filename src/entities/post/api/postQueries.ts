/**
 * 게시글 React Query 훅
 *
 * 게시글 관련 데이터 페칭 작업을 위한 React Query 훅을 제공합니다.
 * 적절한 캐싱 전략과 함께 공유 useApiQuery 훅을 사용합니다.
 */

import { type PostListParams, type PostListResponse } from "@/entities/post/model";
import { useApiQuery } from "@/shared/api/hooks";
import type { ApiError, ApiResponse } from "@/shared/api/types";
import type { UseQueryOptions } from "@tanstack/react-query";

/**
 * 게시글 목록을 가져오는 React Query 훅
 *
 * @param params - 필터링 및 페이지네이션을 위한 선택적 매개변수
 * @returns 게시글 목록 데이터, 로딩 상태, 에러 처리가 포함된 UseQueryResult
 *
 */

export const usePostList = <TSelected = PostListResponse>(params?: PostListParams, options?: Omit<UseQueryOptions<ApiResponse<PostListResponse>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryParams = new URLSearchParams();

  if (params?.keyword) {
    queryParams.append("keyword", params.keyword);
  }

  if (params?.boardId !== undefined) {
    queryParams.append("boardId", params.boardId.toString());
  }

  if (params?.categoryId !== undefined) {
    queryParams.append("categoryId", params.categoryId.toString());
  }

  if (params?.page !== undefined) {
    queryParams.append("page", params.page.toString());
  }

  if (params?.size !== undefined) {
    queryParams.append("size", params.size.toString());
  }

  const endpoint = queryParams.toString() ? `/posts?${queryParams.toString()}` : "/posts";

  const queryKey = ["posts", params] as const;

  return useApiQuery<PostListResponse, TSelected>(queryKey, endpoint, {
    ...options,
  });
};
