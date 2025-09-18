"use client";

import { PostListSkeleton } from "@/entities/post";
import { PostListError } from "@/widgets/post-list/ui/errors/PostListError";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function PostListBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <PostListError error={error} onRetry={resetErrorBoundary} />}>
      <Suspense fallback={<PostListSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
