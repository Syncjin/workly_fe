import { type Post, usePostLike } from "@/entities/post";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, Pagination } from "@workly/types/common";
import { useCallback } from "react";

function isPostListKey(qk: unknown): boolean {
  return Array.isArray(qk) && qk[0] === "posts" && qk[1] === "list";
}
function isPostDetailKey(qk: unknown, postId?: number): boolean {
  if (!Array.isArray(qk)) return false;
  if (qk[0] !== "posts" || qk[1] !== "detail") return false;
  return typeof postId === "number" ? qk[2] === postId : true;
}

function isApiRespPagination<T>(v: any): v is ApiResponse<Pagination<T>> {
  return v && v.data && Array.isArray(v.data.items);
}
function isApiRespArray<T>(v: any): v is ApiResponse<T[]> {
  return v && Array.isArray(v.data);
}
function isInfiniteData<T>(v: any): v is InfiniteData<T> {
  return v && Array.isArray(v.pages);
}
function isApiRespItem<T>(v: any): v is ApiResponse<T> {
  return v && v.data && !Array.isArray(v.data);
}

function toggleLike(p: Post, targetId: number): Post {
  if (p.postId !== targetId) return p;
  return { ...p, isLiked: !(p.isLiked === true) };
}

function patchAnyLike(oldData: unknown, postId: number): unknown {
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

  if (isApiRespItem<Post>(oldData)) {
    return { ...oldData, data: toggleLike(oldData.data, postId) } as ApiResponse<Post>;
  }

  return oldData;
}

export function usePostLikeAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostLike();

  const run = useCallback(
    async (postId: number) => {
      await qc.cancelQueries({
        predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey, postId),
      });

      const snapshots = qc.getQueriesData({
        predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey, postId),
      });

      for (const [key, old] of snapshots) {
        qc.setQueryData(key, patchAnyLike(old, postId));
      }

      try {
        const result = await mutateAsync({ postId });

        qc.invalidateQueries({
          predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey, postId),
        });

        return result;
      } catch (error) {
        for (const [key, snap] of snapshots) {
          qc.setQueryData(key, snap);
        }
        throw error;
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
