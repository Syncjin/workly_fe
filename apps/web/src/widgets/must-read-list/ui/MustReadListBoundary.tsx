"use client";

import { PostListError, PostListSkeleton } from "@/entities/post";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface MustReadListBoundaryProps {
  children: React.ReactNode;
}

export const MustReadListBoundary = ({ children }: MustReadListBoundaryProps) => {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <PostListError error={error} onRetry={resetErrorBoundary} title="필독 게시글을 불러올 수 없습니다" />}>
      <Suspense fallback={<PostListSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

MustReadListBoundary.displayName = "MustReadListBoundary";
