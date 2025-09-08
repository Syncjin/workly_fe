"use client";

import Skeleton from "@/shared/ui/Skeleton";
import { BoardSidebarError } from "@/widgets/board-sidebar/ui/errors/BoardSidebarError";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function SidebarBoundary({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
                <BoardSidebarError error={error} onRetry={resetErrorBoundary} />
            )}
        >
            <Suspense fallback={<Skeleton />}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}