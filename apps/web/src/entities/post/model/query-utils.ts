import { type InfiniteData } from "@tanstack/react-query";
import type { ApiResponse, Pagination } from "@workly/types/common";
import { postQueryKeys } from "./keys";

// 타입 가드들
export function isApiRespPagination<T>(v: any): v is ApiResponse<Pagination<T>> {
  return v && v.data && Array.isArray(v.data.items);
}

export function isApiRespArray<T>(v: any): v is ApiResponse<T[]> {
  return v && Array.isArray(v.data);
}

export function isInfiniteData<T>(v: any): v is InfiniteData<T> {
  return v && Array.isArray(v.pages);
}

// 쿼리 키 매칭
export function isPostListKey(qk: unknown): boolean {
  if (!Array.isArray(qk)) return false;
  const listKeys = postQueryKeys.lists();
  return qk.length >= listKeys.length && listKeys.every((key, index) => qk[index] === key);
}

export function isPostDetailKey(qk: unknown): boolean {
  if (!Array.isArray(qk)) return false;
  const detailKeys = postQueryKeys.details();
  return qk.length >= detailKeys.length && detailKeys.every((key, index) => qk[index] === key);
}
