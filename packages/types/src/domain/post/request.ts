import type { PageParams } from "@workly/types/common/index";

export interface PostListParams extends PageParams {
  boardId?: number;
  categoryId?: number;
  keyword?: string;
}

export interface PostMustReadListParams extends PageParams {
  boardId?: number;
}

export interface PostReadRequest {
  postIds: number[];
}

export interface PostDeleteRequest {
  postIds: number[];
}

export interface PostCreateRequest {
  title: string;
  content: string;
  boardId: number;
}

export interface PostDetailRequest {
  postId: number;
}

export interface PostUpdateRequest {
  postId: number;
}

export interface PostMoveRequest {
  boardId: number;
  postIds: number[];
}

export interface PostLikeRequest {
  postId: number;
}

export interface PostRestoreRequest {
  postIds: number[];
}
