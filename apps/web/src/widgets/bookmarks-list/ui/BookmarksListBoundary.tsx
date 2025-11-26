"use client";

import { PostListError, PostListSkeleton } from "@/entities/post";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface BookmarksListBoundaryProps {
  children: React.ReactNode;
}

export const BookmarksListBoundary = ({ children }: BookmarksListBoundaryProps) => {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <PostListError error={error} onRetry={resetErrorBoundary} title="중요 목록을 불러올 수 없습니다" />}>
      <Suspense fallback={<PostListSkeleton rows={10} />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

BookmarksListBoundary.displayName = "BookmarksListBoundary";
