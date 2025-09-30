"use client";

import { BoardHeaderError } from "@/widgets/post-list/ui/errors/BoardHeaderError";
import { BoardHeaderSkeleton } from "@/widgets/post-list/ui/loading/BoardHeaderSkeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function BoardHeaderBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={() => <BoardHeaderError />}>
      <Suspense fallback={<BoardHeaderSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
