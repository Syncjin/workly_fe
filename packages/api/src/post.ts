import type { ApiResponse, PageParams, Pagination, PostCreateRequest, PostDeleteRequest, PostDetailRequest, PostDTO, PostLikeRequest, PostListParams, PostMoveRequest, PostMoveResponse, PostMustReadListParams, PostReadRequest, PostRestoreRequest, PostUpdateRequest } from "@workly/types";
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
    },
    /** 게시글 좋아요 */
    postPostsLike: (params: PostLikeRequest): Promise<ApiResponse<PostDTO>> => {
      return http.post<PostDTO>(`/posts/${params.postId}/likes`);
    },

    /** 게시글 안읽은 목록  */
    getPostsUnread: async (params?: PostListParams): Promise<ApiResponse<Pagination<PostDTO>>> => {
      const query = qs({
        keyword: params?.keyword,
        boardId: params?.boardId,
        categoryId: params?.categoryId,
        page: params?.page,
        size: params?.size,
      });
      return http.get<Pagination<PostDTO>>(`/posts/unread${query}`);
    },

    /** 게시글 휴지통 목록  */
    getPostsTrash: async (params?: PageParams): Promise<ApiResponse<Pagination<PostDTO>>> => {
      const query = qs({
        page: params?.page,
        size: params?.size,
      });
      return http.get<Pagination<PostDTO>>(`/posts/trash${query}`);
    },

    /** 게시글 내 작성 목록  */
    getPostsMyPosts: async (params?: PageParams): Promise<ApiResponse<Pagination<PostDTO>>> => {
      const query = qs({
        page: params?.page,
        size: params?.size,
      });
      return http.get<Pagination<PostDTO>>(`/posts/myPosts${query}`);
    },

    /** 게시글 필독 목록  */
    getPostsMustRead: async (params?: PostMustReadListParams): Promise<ApiResponse<Pagination<PostDTO>>> => {
      const query = qs({
        boardId: params?.boardId,
        page: params?.page,
        size: params?.size,
      });
      return http.get<Pagination<PostDTO>>(`/posts/must-read${query}`);
    },

    /** 게시글 스크랩 목록  */
    getPostsBookmarks: async (params?: PageParams): Promise<ApiResponse<Pagination<PostDTO>>> => {
      const query = qs({
        page: params?.page,
        size: params?.size,
      });
      return http.get<Pagination<PostDTO>>(`/posts/bookmarks${query}`);
    },

    /** 게시글 휴지통 복원 */
    postPostsRestore: (body: PostRestoreRequest): Promise<ApiResponse<any>> => {
      return http.post<any>(`/posts/restore`, body);
    },

    /** 게시글 휴지통 비우기. 전체 영구 삭제 */
    deletePostsTrash: (): Promise<ApiResponse<any>> => {
      return http.delete<any>(`/posts/trash`);
    },

    /** 게시글 스크랩 업데이트 */
    postPostsBookmarks: (params: { postId: number }): Promise<ApiResponse<PostDTO>> => {
      return http.post<PostDTO>(`/posts/${params.postId}/bookmarks`);
    },

    /** 게시글 필독 설정 */
    postPostsMustRead: (params: { postId: number }): Promise<ApiResponse<PostDTO>> => {
      return http.post<PostDTO>(`/posts/${params.postId}/must-read`);
    },
  };
}
