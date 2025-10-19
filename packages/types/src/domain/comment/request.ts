import type { CommentReactionDTO, PageParams } from "@workly/types";

export interface CommentListParams extends PageParams {
  postId: number;
}

export interface CommentCreateRequest {
  postId: number;
  content: string;
}

export interface CommentDetailRequest {
  postId: number;
  commentId: number;
}
export interface CommentUpdateRequest {
  postId: number;
  commentId: number;
  content: string;
}
export interface CommentDeleteRequest {
  postId: number;
  commentId: number;
}

export interface CommentReactionUpsertRequest {
  commentId: number;
  commentReaction: CommentReactionDTO;
}

export interface CommentReactionParams {
  commentId: number;
}

export interface CommentReactionDeleteRequest {
  commentId: number;
}
