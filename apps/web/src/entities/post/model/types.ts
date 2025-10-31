/**
 * Post entity types
 *
 */

import { FileInfo } from "@/entities/file";
import { User } from "@/entities/users";
import type { PostListParams as BasePostListParams, PostCreateRequest, PostDTO, PostUpdateRequest } from "@workly/types";
export type { PostCreateRequest, PostDeleteRequest, PostDetailRequest, PostLikeRequest, PostMoveRequest, PostMoveResponse, PostReadRequest } from "@workly/types";

export interface PostListParams extends BasePostListParams {
  filter?: "all" | "unread";
}

export type Post = Omit<PostDTO, "user" | "fileInfos"> & {
  user: User;
  fileInfos: FileInfo[];
};

export type PostCreateParams = {
  post: PostCreateRequest;
  files?: File[];
};

export type PostUpdateParams = {
  params: PostUpdateRequest;
  post: PostCreateRequest;
  files?: File[];
};
