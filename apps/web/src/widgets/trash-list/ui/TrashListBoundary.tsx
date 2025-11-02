"use client";

import { PostListError, PostListSkeleton } from "@/entities/post";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface TrashListBoundaryProps {
  children: React.ReactNode;
}

export const TrashListBoundary = ({ children }: TrashListBoundaryProps) => {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <PostListError error={error} onRetry={resetErrorBoundary} title="휴지통을 불러올 수 없습니다" />}>
      <Suspense fallback={<PostListSkeleton rows={10} />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

TrashListBoundary.displayName = "TrashListBoundary";
