"use client";

import { PostListSkeleton } from "@/widgets/post-list/ui/loading/PostListSkeleton";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TrashErrorState } from "./TrashErrorState";

interface TrashListBoundaryProps {
  children: React.ReactNode;
}

export const TrashListBoundary = ({ children }: TrashListBoundaryProps) => {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <TrashErrorState error={error} onRetry={resetErrorBoundary} />}>
      <Suspense fallback={<PostListSkeleton rows={10} />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

TrashListBoundary.displayName = "TrashListBoundary";
