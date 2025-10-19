import { commentApi } from "@/entities/comment/api";
import { Comment, CommentCreateRequest, CommentDeleteRequest, CommentDetailRequest, CommentListParams, commentQueryKeys, CommentReactionDeleteRequest, CommentReactionParams, CommentReactionUpsertRequest, CommentUpdateRequest, Reaction } from "@/entities/comment/model";
import { useApiMutation, useApiQuery } from "@/shared/api/hooks";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiError, ApiResponse, Pagination } from "@workly/types";

export const useCommentList = <TSelected = ApiResponse<Pagination<Comment>>>(params: CommentListParams, options?: Omit<UseQueryOptions<ApiResponse<Pagination<Comment>>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = commentQueryKeys.list(params);

  return useApiQuery<Pagination<Comment>, TSelected>(queryKey, () => commentApi.getCommentList(params), {
    ...options,
  });
};

export const useCommentDetail = <TSelected = ApiResponse<Comment>>(params: CommentDetailRequest, options?: Omit<UseQueryOptions<ApiResponse<Comment>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = commentQueryKeys.detail(params.commentId);

  return useApiQuery<Comment, TSelected>(queryKey, () => commentApi.getCommentDetail(params), {
    ...options,
  });
};

export const useCommentUpdate = () => {
  return useApiMutation<Comment, CommentUpdateRequest>((params) => commentApi.patchCommentUpdate(params), {});
};

export const useCommentDelete = () => {
  return useApiMutation<void, CommentDeleteRequest>((params) => commentApi.deleteComment(params), {});
};

export const useCommentCreate = () => {
  return useApiMutation<Comment, CommentCreateRequest>((params) => commentApi.postCommentCreate(params), {});
};

export const useCommentReactionDelete = () => {
  return useApiMutation<Comment, CommentReactionDeleteRequest>((params) => commentApi.deleteCommentReaction(params), {});
};

export const useCommentReaction = <TSelected = ApiResponse<Reaction>>(params: CommentReactionParams, options?: Omit<UseQueryOptions<ApiResponse<Reaction>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = commentQueryKeys.reaction(params.commentId);

  return useApiQuery<Reaction, TSelected>(queryKey, () => commentApi.getCommentReaction(params), {
    ...options,
  });
};

export const useCommentReactionUpsert = () => {
  return useApiMutation<Comment, CommentReactionUpsertRequest>((params) => commentApi.postCommentReaction(params), {});
};
