/**
 * 게시글 React Query 훅
 *
 * 게시글 관련 데이터 페칭 작업을 위한 React Query 훅을 제공합니다.
 * 적절한 캐싱 전략과 함께 공유 useApiQuery 훅을 사용합니다.
 */

import type { PageParams, PostLikeRequest, PostMustReadListParams, PostRestoreRequest } from "@/entities/post";
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

export const usePostLike = () => {
  return useApiMutation<Post, PostLikeRequest>((params) => postApi.postPostsLike(params), {});
};

export const usePostDetailSuspense = <TSelected = ApiResponse<Post>>(params: PostDetailRequest, options?: Omit<UseQueryOptions<ApiResponse<Post>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.detail(params.postId);

  return useApiSuspenseQuery<Post, TSelected>(queryKey, () => postApi.getPostsDetail(params), {
    ...options,
  });
};

export const usePostUnreadList = <TSelected = ApiResponse<Pagination<Post>>>(params?: PostListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.unreadList(params);

  return useApiQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPostsUnread(params), {
    ...options,
  });
};

/**
 * 안읽은 게시글 목록을 가져오는 Suspense 훅
 */
export const useUnreadPostsSuspense = <TSelected = ApiResponse<Pagination<Post>>>(params?: PostListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.unreadList(params);

  return useApiSuspenseQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPostsUnread(params), {
    ...options,
  });
};

/**
 * 휴지통 게시글 목록을 가져오는 Suspense 훅
 */
export const useTrashPostsSuspense = <TSelected = ApiResponse<Pagination<Post>>>(params?: PostListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.trash(params);

  return useApiSuspenseQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPostsTrash(params), {
    ...options,
  });
};

/**
 * 내 게시글 목록을 가져오는 Suspense 훅
 */
export const useMyPostsSuspense = <TSelected = ApiResponse<Pagination<Post>>>(params?: PageParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.myPosts(params);

  return useApiSuspenseQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPostsMyPosts(params), {
    ...options,
  });
};

/**
 * 필독 게시글 목록을 가져오는 Suspense 훅
 */
export const useMustReadPostsSuspense = <TSelected = ApiResponse<Pagination<Post>>>(params?: PostMustReadListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.mustRead(params);

  return useApiSuspenseQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPostsMustRead(params), {
    ...options,
  });
};

/**
 * 스크랩 게시글 목록을 가져오는 Suspense 훅
 */
export const useBookmarkedPostsSuspense = <TSelected = ApiResponse<Pagination<Post>>>(params?: PageParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Post>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = postQueryKeys.bookmarks(params);

  return useApiSuspenseQuery<Pagination<Post>, TSelected>(queryKey, () => postApi.getPostsBookmarks(params), {
    ...options,
  });
};
/**
 * 게시글 복원 훅
 */
export const usePostRestore = () => {
  return useApiMutation<any, PostRestoreRequest>((params) => postApi.postPostsRestore(params), {});
};

/**
 * 휴지통 전체 비우기 (영구 삭제) 훅
 */
export const usePostTrash = () => {
  return useApiMutation<any, void>(() => postApi.deletePostsTrash(), {});
};

/**
 * 게시글 필독 설정 훅
 */
export const usePostMustRead = () => {
  return useApiMutation<Post, { postId: number }>((params) => postApi.postPostsMustRead(params), {});
};

/**
 * 게시글 스크랩 설정 훅
 */
export const usePostBookmarks = () => {
  return useApiMutation<Post, { postId: number }>((params) => postApi.postPostsBookmarks(params), {});
};
