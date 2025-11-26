import { type InfiniteData } from "@tanstack/react-query";
import type { ApiResponse, Pagination } from "@workly/types/common";
import { postQueryKeys } from "./keys";

// 타입 가드들
export function isApiRespPagination<T>(v: unknown): v is ApiResponse<Pagination<T>> {
  return typeof v === "object" && v !== null && "data" in v && typeof v.data === "object" && v.data !== null && "items" in v.data && Array.isArray(v.data.items);
}

export function isApiRespArray<T>(v: unknown): v is ApiResponse<T[]> {
  return typeof v === "object" && v !== null && "data" in v && Array.isArray(v.data);
}

export function isInfiniteData<T>(v: unknown): v is InfiniteData<T> {
  return typeof v === "object" && v !== null && "pages" in v && Array.isArray(v.pages);
}

// 쿼리 키 매칭
export function isPostListKey(qk: unknown): boolean {
  if (!Array.isArray(qk)) return false;

  // 모든 게시글 목록 쿼리 키 패턴들을 확인
  const listKeyPatterns = [
    postQueryKeys.lists(), // ["posts", "list"]
    postQueryKeys.unreadLists(), // ["posts", "unread", "list"]
    postQueryKeys.trashLists(), // ["posts", "trash", "list"]
    postQueryKeys.myPostsLists(), // ["posts", "my-posts", "list"]
    postQueryKeys.mustReadLists(), // ["posts", "must-read", "list"]
    postQueryKeys.bookmarksLists(), // ["posts", "bookmarks", "list"]
  ];

  return listKeyPatterns.some((pattern) => qk.length >= pattern.length && pattern.every((key, index) => qk[index] === key));
}

export function isPostDetailKey(qk: unknown): boolean {
  if (!Array.isArray(qk)) return false;
  const detailKeys = postQueryKeys.details();
  return qk.length >= detailKeys.length && detailKeys.every((key, index) => qk[index] === key);
}
