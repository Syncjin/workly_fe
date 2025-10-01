import type { PageParams } from "@workly/types/common/index";

export interface PostListParams extends PageParams {
  boardId?: number;
  categoryId?: number;
  keyword?: string;
}

export interface PostReadRequest {
  postIds: number[];
}

export interface PostDeleteRequest {
  postIds: number[];
}
