/**
 * Post entity types
 *
 */

import { PostCreateRequest } from "@workly/types";

export type { PostDTO as Post, PostCreateRequest, PostDeleteRequest, PostListParams, PostReadRequest } from "@workly/types/domain";
export type PostCreateParams = {
  post: PostCreateRequest;
  files?: File[];
};
