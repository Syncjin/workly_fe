import { type InfiniteData } from "@tanstack/react-query";
import type { ApiResponse, Pagination } from "@workly/types/common";
import { isApiRespArray, isApiRespPagination, isInfiniteData } from "./query-utils";
import { type Post } from "./types";

// 게시글 삭제용 변환기
export function removeIdsFromList(oldData: unknown, idSet: Set<number>): unknown {
  if (!oldData) return oldData;

  if (isApiRespPagination<Post>(oldData)) {
    const { items, size, totalItems } = oldData.data;
    const nextItems = items.filter((p) => !idSet.has(p.postId));
    const removedHere = items.length - nextItems.length;

    const nextTotalItems = Math.max(0, totalItems - removedHere);
    const nextTotalPages = size > 0 ? Math.ceil(nextTotalItems / size) : 0;

    return {
      ...oldData,
      data: {
        ...oldData.data,
        items: nextItems,
        totalItems: nextTotalItems,
        totalPages: nextTotalPages,
      },
    } as ApiResponse<Pagination<Post>>;
  }

  if (isApiRespArray<Post>(oldData)) {
    return {
      ...oldData,
      data: oldData.data.filter((p) => !idSet.has(p.postId)),
    } as ApiResponse<Post[]>;
  }

  if (isInfiniteData(oldData)) {
    return {
      ...oldData,
      pages: oldData.pages.map((page: unknown) => removeIdsFromList(page, idSet)),
    } as InfiniteData<unknown>;
  }

  return oldData;
}

// 게시글 읽음 처리용 변환기
function markRead(p: Post, ids: Set<number>): Post {
  if (!ids.has(p.postId)) return p;
  const already = p.isRead === true;
  return {
    ...p,
    isRead: true,
    readCount: already ? p.readCount : p.readCount + 1,
  };
}

// 게시글 읽음 목록 처리 변환
export function patchListDataAsRead(oldData: unknown, idSet: Set<number>): unknown {
  if (!oldData) return oldData;

  if (isApiRespPagination<Post>(oldData)) {
    return {
      ...oldData,
      data: {
        ...oldData.data,
        items: oldData.data.items.map((p) => markRead(p, idSet)),
      },
    } as ApiResponse<Pagination<Post>>;
  }

  if (isApiRespArray<Post>(oldData)) {
    return {
      ...oldData,
      data: oldData.data.map((p) => markRead(p, idSet)),
    } as ApiResponse<Post[]>;
  }

  if (isInfiniteData(oldData)) {
    return {
      ...oldData,
      pages: oldData.pages.map((page: unknown) => patchListDataAsRead(page, idSet)),
    } as InfiniteData<unknown>;
  }

  return oldData;
}

// 게시글 좋아요 처리 변환
function toggleLike(p: Post, targetId: number): Post {
  if (p.postId !== targetId) return p;
  return { ...p, isLiked: !(p.isLiked === true) };
}

export function patchAnyLike(oldData: unknown, postId: number): unknown {
  if (!oldData) return oldData;

  if (isApiRespPagination<Post>(oldData)) {
    return {
      ...oldData,
      data: {
        ...oldData.data,
        items: oldData.data.items.map((p) => toggleLike(p, postId)),
      },
    } as ApiResponse<Pagination<Post>>;
  }

  if (isApiRespArray<Post>(oldData)) {
    return {
      ...oldData,
      data: oldData.data.map((p) => toggleLike(p, postId)),
    } as ApiResponse<Post[]>;
  }

  if (isInfiniteData(oldData)) {
    return {
      ...oldData,
      pages: oldData.pages.map((page: unknown) => patchAnyLike(page, postId)),
    } as InfiniteData<unknown>;
  }

  return oldData;
}

// 게시글 이동용 변환기 (이동된 게시글들을 현재 보드에서 제거)
export function movePostsFromList(oldData: unknown, payload: { postIds: Set<number>; targetBoardId: number }): unknown {
  // 이동은 삭제와 동일하게 현재 리스트에서 제거
  return removeIdsFromList(oldData, payload.postIds);
}

// 게시글 스크랩 처리 변환
function toggleBookmark(p: Post, targetId: number): Post {
  if (p.postId !== targetId) return p;
  return { ...p, isBookmarked: !(p.isBookmarked === true) };
}

export function patchAnyBookmark(oldData: unknown, postId: number): unknown {
  if (!oldData) return oldData;

  if (isApiRespPagination<Post>(oldData)) {
    return {
      ...oldData,
      data: {
        ...oldData.data,
        items: oldData.data.items.map((p) => toggleBookmark(p, postId)),
      },
    } as ApiResponse<Pagination<Post>>;
  }

  if (isApiRespArray<Post>(oldData)) {
    return {
      ...oldData,
      data: oldData.data.map((p) => toggleBookmark(p, postId)),
    } as ApiResponse<Post[]>;
  }

  if (isInfiniteData(oldData)) {
    return {
      ...oldData,
      pages: oldData.pages.map((page: unknown) => patchAnyBookmark(page, postId)),
    } as InfiniteData<unknown>;
  }

  return oldData;
}
