"use client";

import { PostSectionError } from "@/widgets/post-list/ui/errors/PostSectionError";
import { PostSectionSkeleton } from "@/widgets/post-list/ui/loading/PostSectionSkeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PostSectionBoundaryProps {
  children: React.ReactNode;
  skeletonCount?: number;
}

/**
 * 게시글 섹션을 위한 에러 바운더리 + Suspense 래퍼
 * 각 섹션의 오류를 독립적으로 처리하고 로딩 상태를 표시
 */
export function PostSectionBoundary({ children, skeletonCount = 3 }: PostSectionBoundaryProps) {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <PostSectionError error={error} onRetry={resetErrorBoundary} />}>
      <Suspense fallback={<PostSectionSkeleton itemCount={skeletonCount} />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
