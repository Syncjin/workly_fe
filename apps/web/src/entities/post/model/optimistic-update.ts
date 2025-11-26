import { type QueryClient } from "@tanstack/react-query";
import { isPostListKey } from "./query-utils";

export function createOptimisticUpdater<T, R = unknown>(queryClient: QueryClient, dataTransformer: (oldData: unknown, payload: T) => unknown) {
  return async (payload: T, mutationFn: () => Promise<R>) => {
    // 쿼리 취소
    await queryClient.cancelQueries({
      predicate: ({ queryKey }) => isPostListKey(queryKey),
    });

    // 스냅샷 저장 및 낙관적 업데이트
    const snapshots = queryClient.getQueriesData({
      predicate: ({ queryKey }) => isPostListKey(queryKey),
    });

    for (const [key, old] of snapshots) {
      queryClient.setQueryData(key, dataTransformer(old, payload));
    }

    try {
      return await mutationFn();
    } catch (e) {
      // 롤백
      for (const [key, snap] of snapshots) {
        queryClient.setQueryData(key, snap);
      }
      throw e;
    } finally {
      // 무효화
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => isPostListKey(queryKey),
      });
    }
  };
}
