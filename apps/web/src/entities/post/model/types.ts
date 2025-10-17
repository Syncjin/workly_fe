/**
 * Post entity types
 *
 */

import type { PostCreateRequest, PostUpdateRequest } from "@workly/types";
export type { PostDTO as Post, PostCreateRequest, PostDeleteRequest, PostDetailRequest, PostListParams, PostMoveRequest, PostMoveResponse, PostReadRequest } from "@workly/types/domain";

export type PostCreateParams = {
  post: PostCreateRequest;
  files?: File[];
};

export type PostUpdateParams = {
  params: PostUpdateRequest;
  post: PostCreateRequest;
  files?: File[];
};
