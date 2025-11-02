"use client";

import { PostListError, PostListSkeleton } from "@/entities/post";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PostListBoundaryProps {
  children: React.ReactNode;
}

export function PostListBoundary({ children }: PostListBoundaryProps) {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <PostListError error={error} onRetry={resetErrorBoundary} />}>
      <Suspense fallback={<PostListSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

PostListBoundary.displayName = "PostListBoundary";
