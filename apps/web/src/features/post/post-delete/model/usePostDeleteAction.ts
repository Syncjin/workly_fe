import { type Post, usePostDelete } from "@/entities/post";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, Pagination } from "@workly/types/common";
import { useCallback } from "react";

function isApiRespPagination<T>(v: any): v is ApiResponse<Pagination<T>> {
  return v && v.data && Array.isArray(v.data.items);
}

function isApiRespArray<T>(v: any): v is ApiResponse<T[]> {
  return v && Array.isArray(v.data);
}

function isInfiniteData<T>(v: any): v is InfiniteData<T> {
  return v && Array.isArray(v.pages);
}

function isPostListKey(qk: unknown): boolean {
  return Array.isArray(qk) && qk[0] === "posts" && qk[1] === "list";
}

function removeIdsFromList(oldData: unknown, idSet: Set<number>): unknown {
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

export function usePostDeleteAction() {
  const qc = useQueryClient();
  const { mutateAsync } = usePostDelete();

  const run = useCallback(
    async (postIds: number[]) => {
      const ids = Array.from(new Set(postIds)).filter((n) => Number.isFinite(n));
      if (ids.length === 0) return;
      const idSet = new Set(ids);

      // 낙관적 업데이트 준비
      await qc.cancelQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
      const snapshots = qc.getQueriesData({ predicate: ({ queryKey }) => isPostListKey(queryKey) });

      console.log("snapshots", snapshots);
      for (const [key, old] of snapshots) {
        qc.setQueryData(key, removeIdsFromList(old, idSet));
      }

      try {
        await mutateAsync({ postIds: ids });
      } catch (e) {
        // 롤백
        for (const [key, snap] of snapshots) qc.setQueryData(key, snap);
        throw e;
      } finally {
        // 정합성 보장
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
      }
    },
    [qc, mutateAsync]
  );

  return { run };
}
