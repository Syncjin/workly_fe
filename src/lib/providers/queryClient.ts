import { log } from "@/lib/logger";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 설정
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 최대 3번 재시도
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // 뮤테이션 기본 설정
      retry: false,
      onError: (error: any) => {
        log.error("Mutation error", error);
      },
    },
  },
});

// TanStack Query v5 이벤트 리스너를 통한 로깅
queryClient.getQueryCache().subscribe((event) => {
  switch (event.type) {
    case "added":
      log.debug(`Query added: ${event.query.queryHash}`);
      break;
    case "updated":
      log.debug(`Query updated: ${event.query.queryHash}`);
      break;
    case "removed":
      log.debug(`Query removed: ${event.query.queryHash}`);
      break;
    case "observerAdded":
      log.debug(`Query observer added: ${event.query.queryHash}`);
      break;
    case "observerRemoved":
      log.debug(`Query observer removed: ${event.query.queryHash}`);
      break;
    case "observerResultsUpdated":
      log.debug(`Query observer results updated: ${event.query.queryHash}`);
      break;
    case "observerOptionsUpdated":
      log.debug(`Query observer options updated: ${event.query.queryHash}`);
      break;
  }
});

queryClient.getMutationCache().subscribe((event) => {
  switch (event.type) {
    case "added":
      log.debug(`Mutation added: ${event.mutation.mutationId}`);
      break;
    case "updated":
      log.debug(`Mutation updated: ${event.mutation.mutationId}`);
      break;
    case "removed":
      log.debug(`Mutation removed: ${event.mutation.mutationId}`);
      break;
  }
});
