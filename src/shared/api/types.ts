// API 응답 타입
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  code: string;
  message?: string;
  timestamp: string;
}

// API 에러 타입
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// 쿼리 키 팩토리
export const createQueryKey = {
  // 사용자 관련
  users: () => ["users"] as const,
  user: (id: string) => ["users", id] as const,

  // 게시물 관련
  posts: () => ["posts"] as const,
  post: (id: string) => ["posts", id] as const,

  // 댓글 관련
  comments: (postId: string) => ["posts", postId, "comments"] as const,
  comment: (id: string) => ["comments", id] as const,

  // 파일 관련
  files: () => ["files"] as const,
  file: (id: string) => ["files", id] as const,
};
