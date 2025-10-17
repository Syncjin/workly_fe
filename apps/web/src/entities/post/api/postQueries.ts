/**
 * 게시글 React Query 훅
 *
 * 게시글 관련 데이터 페칭 작업을 위한 React Query 훅을 제공합니다.
 * 적절한 캐싱 전략과 함께 공유 useApiQuery 훅을 사용합니다.
 */

import { postApi, postQueryKeys, type Post, type PostCreateParams, type PostDeleteRequest, type PostDetailRequest, type PostListParams, type PostMoveRequest, type PostMoveResponse, type PostReadRequest, type PostUpdateParams } from "@/entities/post";
import { useApiMutation, useApiQuery, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiError, ApiResponse, Pagination } from "@workly/types/common";

/**
 * 게시글 목록을 가져오는 React Query 훅
 *
 * @param params - 필터링 및 페이지네이션을 위한 선택적 매개변수
 * @returns 게시글 목록 데이터, 로딩 상태, 에러 처리가 포함된 UseQueryResult
 *
 */

export const usePostList = <TSelected = ApiResponse<Pagination<Post>>>(params?: PostListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.list(params);

  return useApiQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPosts(params), {
    ...options,
  });
};

export const usePostListSuspense = <TSelected = ApiResponse<Pagination<Post>>>(params?: PostListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.list(params);

  return useApiSuspenseQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPosts(params), {
    ...options,
  });
};

export const usePostRead = () => {
  return useApiMutation<void, PostReadRequest>((params) => postApi.postPostsRead(params), {});
};

export const usePostDelete = () => {
  return useApiMutation<void, PostDeleteRequest>((params) => postApi.deletePosts(params), {});
};

export const usePostCreate = () => {
  return useApiMutation<Post, PostCreateParams>((params) => postApi.postPosts(params.post, params?.files), {});
};

export const usePostUpdate = () => {
  return useApiMutation<Post, PostUpdateParams>((params) => postApi.patchPosts(params.params, params.post, params?.files), {});
};

export const usePostMove = () => {
  return useApiMutation<PostMoveResponse, PostMoveRequest>((params) => postApi.patchPostsMove(params), {});
};

export const usePostDetailSuspense = <TSelected = ApiResponse<Post>>(params: PostDetailRequest, options?: Omit<UseQueryOptions<ApiResponse<Post>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.detail(params.postId);

  return useApiSuspenseQuery<Post, TSelected>(queryKey, () => postApi.getPostsDetail(params), {
    ...options,
  });
};
