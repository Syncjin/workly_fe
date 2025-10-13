import { type Post, usePostRead } from "@/entities/post";
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

// 이미 읽음이면 증가 x
function markRead(p: Post, ids: Set<number>): Post {
  if (!ids.has(p.postId)) return p;
  const already = p.isRead === true;
  return {
    ...p,
    isRead: true,
    readCount: already ? p.readCount : p.readCount + 1,
  };
}

function isPostListKey(qk: unknown): boolean {
  return Array.isArray(qk) && qk[0] === "posts" && qk[1] === "list";
}

function patchListData(oldData: unknown, idSet: Set<number>): unknown {
  if (!oldData) return oldData;

  console.log("patchListData", oldData);
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
      pages: oldData.pages.map((page: unknown) => patchListData(page, idSet)),
    } as InfiniteData<unknown>;
  }

  return oldData;
}

export function usePostReadAction() {
  const qc = useQueryClient();

  const { mutateAsync } = usePostRead();

  const run = useCallback(
    async (postIds: number[]) => {
      const ids = Array.from(new Set(postIds));
      if (ids.length === 0) return;

      // 낙관적 업데이트 준비
      await qc.cancelQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
      const snapshots = qc.getQueriesData({ predicate: ({ queryKey }) => isPostListKey(queryKey) });

      console.log("snapshots", snapshots);
      for (const [key, old] of snapshots) {
        qc.setQueryData(key, patchListData(old, new Set(ids)));
      }

      try {
        return await mutateAsync({ postIds: ids });
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
