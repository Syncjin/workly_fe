import type { ApiResponse, Pagination } from "@workly/types/common";
import type { PostDeleteRequest, PostDTO, PostListParams, PostReadRequest } from "@workly/types/domain";
import type { HttpClient } from "./http";

function qs(params?: Record<string, unknown>) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function createPostApi(http: HttpClient) {
  
  return {
    /** 게시글 목록 (DTO 반환) */
    getPosts: async (params?: PostListParams): Promise<ApiResponse<Pagination<PostDTO>>> => {
        const query = qs({
            keyword: params?.keyword,
            boardId: params?.boardId,
            categoryId: params?.categoryId,
            page: params?.page,
            size: params?.size,
        });
        return http.get<Pagination<PostDTO>>(`/posts${query}`);
    },
     /** 게시글 읽음 마킹 */
    postPostsRead: (body: PostReadRequest): Promise<ApiResponse<void>> => {
      return http.post<void>(`/posts/reads`, body);
    },

    /** 게시글 삭제 (휴지통 이동) */
    deletePosts: (body: PostDeleteRequest): Promise<ApiResponse<void>> => {
      return http.delete<void>(`/posts`, body);
    },
  };
}
