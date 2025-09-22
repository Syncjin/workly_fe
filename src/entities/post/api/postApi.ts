/**
 * Post API functions
 *
 */

import type { Pagination, Post, PostByIdReadRequest, PostListParams } from "@/entities/post/model";
import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

/**
 * Post API functions
 */
export const postApi = {
  getPosts: async (params?: PostListParams): Promise<ApiResponse<Pagination<Post>>> => {
    const queryParams = new URLSearchParams();

    if (params?.keyword) {
      queryParams.append("keyword", params.keyword);
    }

    if (params?.boardId !== undefined) {
      queryParams.append("boardId", params.boardId.toString());
    }

    if (params?.categoryId !== undefined) {
      queryParams.append("categoryId", params.categoryId.toString());
    }

    if (params?.page !== undefined) {
      queryParams.append("page", params.page.toString());
    }

    if (params?.size !== undefined) {
      queryParams.append("size", params.size.toString());
    }

    const endpoint = queryParams.toString() ? `/posts?${queryParams.toString()}` : "/posts";

    return await api.get<Pagination<Post>>(endpoint);
  },
  postPostsByIdRead: async (params?: PostByIdReadRequest): Promise<ApiResponse<void>> => {
    return await api.post<void>(`/posts/${params?.postId}/reads`);
  },
};
