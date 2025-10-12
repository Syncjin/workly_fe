import type { ApiResponse, Pagination } from "@workly/types/common";
import type { PostCreateRequest, PostDeleteRequest, PostDetailRequest, PostDTO, PostListParams, PostMoveRequest, PostMoveResponse, PostReadRequest, PostUpdateRequest } from "@workly/types/domain";
import { qs } from "@workly/utils";
import type { HttpClient } from "./http";


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
     /** 게시글 단건 */
    getPostsDetail: async (params: PostDetailRequest): Promise<ApiResponse<PostDTO>> => {
        return http.get<PostDTO>(`/posts/${params.postId}`);
    },
     /** 게시글 읽음 마킹 */
    postPostsRead: (body: PostReadRequest): Promise<ApiResponse<void>> => {
      return http.post<void>(`/posts/reads`, body);
    },

    /** 게시글 삭제 (휴지통 이동) */
    deletePosts: (body: PostDeleteRequest): Promise<ApiResponse<void>> => {
      return http.delete<void>(`/posts`, body);
    },

     /** 게시글 수정 */
    patchPosts: (params: PostUpdateRequest, post: PostCreateRequest, files?: File[]): Promise<ApiResponse<PostDTO>> => {
      const fd = new FormData();
      fd.append("post", new Blob([JSON.stringify(post)], { type: "application/json" }));
      (files ?? []).forEach((f) => fd.append("files", f));
      return http.patchMultipart<PostDTO>(`/posts/${params.postId}`, fd);
    },
     /** 게시글 이동 */
    patchPostsMove: (body: PostMoveRequest): Promise<ApiResponse<PostMoveResponse>> => {
      return http.patch<PostMoveResponse>(`/posts/move`, body);
    },
    postPosts: (post: PostCreateRequest, files?: File[]): Promise<ApiResponse<PostDTO>> => {
      const fd = new FormData();
      fd.append("post", new Blob([JSON.stringify(post)], { type: "application/json" }));
      (files ?? []).forEach((f) => fd.append("files", f));
      return http.postMultipart<PostDTO>(`/posts`, fd);
    }
  };
}