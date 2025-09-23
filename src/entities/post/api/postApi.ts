/**
 * Post API functions
 *
 */

import type { Post, PostDeleteRequest, PostListParams, PostReadRequest } from "@/entities/post/model";
import { api } from "@/shared/api/client";
import type { ApiResponse, Pagination } from "@/shared/api/types";

/**
 * Post API functions
 */

function toQueryString(params?: Record<string, any>) {
  const q = new URLSearchParams();
  if (!params) return "";

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    q.append(k, String(v));
  });

  const s = q.toString();
  return s ? `?${s}` : "";
}

export const postApi = {
  /** 게시글 목록 */
  getPosts: async (params?: PostListParams): Promise<ApiResponse<Pagination<Post>>> => {
    const query = toQueryString({
      keyword: params?.keyword,
      boardId: params?.boardId,
      categoryId: params?.categoryId,
      page: params?.page,
      size: params?.size,
    });
    return api.get<Pagination<Post>>(`/posts${query}`);
  },
  /** 게시글 읽음 마킹 */
  postPostsRead: async (params: PostReadRequest): Promise<ApiResponse<void>> => {
    return api.post<void>(`/posts/reads`, params);
  },
  /** 게시글 삭제 (휴지통 이동) */
  deletePosts: async (params: PostDeleteRequest): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/posts`, params);
  },
};
