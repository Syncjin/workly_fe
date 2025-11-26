import { qs } from "@workly/utils";

import type { ApiResponse, CommentCreateRequest, CommentDeleteRequest, CommentDetailRequest, CommentDTO, CommentListParams, CommentReactionDeleteRequest, CommentReactionParams, CommentReactionUpsertRequest, CommentUpdateRequest, Pagination, ReactionDTO } from "@workly/types";
import type { HttpClient } from "./http";

export function createCommentApi(http: HttpClient) {
  return {
    /** 댓글 목록 조회 */
    getCommentList: async (params?: CommentListParams): Promise<ApiResponse<Pagination<CommentDTO>>> => {
      const query = qs({
        page: params?.page,
        size: params?.size,
      });
      return http.get<Pagination<CommentDTO>>(`/posts/${params?.postId}/comments${query}`);
    },
    /** 댓글 단건 조회 */
    getCommentDetail: async (params: CommentDetailRequest): Promise<ApiResponse<CommentDTO>> => {
      return http.get<CommentDTO>(`/posts/${params.postId}/comments/${params.commentId}`);
    },
    /** 댓글 수정 */
    patchCommentUpdate: (params: CommentUpdateRequest): Promise<ApiResponse<CommentDTO>> => {
      const body = {
        content: params.content,
      };
      return http.patch<CommentDTO>(`/posts/${params.postId}/comments/${params.commentId}`, body);
    },
    /** 댓글 삭제 */
    deleteComment: (params: CommentDeleteRequest): Promise<ApiResponse<void>> => {
      return http.delete<void>(`/posts/${params.postId}/comments/${params.commentId}`);
    },
    /** 댓글 작성 */
    postCommentCreate: (params: CommentCreateRequest): Promise<ApiResponse<CommentDTO>> => {
      const body = {
        content: params.content,
        parentId: params.parentId ? params.parentId : null,
      };
      return http.post<CommentDTO>(`/posts/${params.postId}/comments`, body);
    },
    /** 댓글 리액션 삭제 */
    deleteCommentReaction: (params: CommentReactionDeleteRequest): Promise<ApiResponse<CommentDTO>> => {
      return http.delete<CommentDTO>(`/comments/${params.commentId}/reaction`);
    },
    /** 댓글 리액션 통계 조회 */
    getCommentReaction: async (params: CommentReactionParams): Promise<ApiResponse<ReactionDTO>> => {
      return http.get<ReactionDTO>(`/comments/${params.commentId}/reaction`);
    },
    /** 댓글 리액션 작성/수정 */
    postCommentReaction: async (params: CommentReactionUpsertRequest): Promise<ApiResponse<CommentDTO>> => {
      const body = {
        commentReaction: params.commentReaction,
      };
      return http.post<CommentDTO>(`/comments/${params.commentId}/reaction`, body);
    },
  };
}
