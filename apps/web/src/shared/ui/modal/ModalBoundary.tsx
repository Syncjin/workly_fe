"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@workly/ui";
import { PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type ModalQueryBoundaryProps = PropsWithChildren<{
  pending: React.ReactNode; // 모달 콘텐츠 로딩 UI
  onClose: () => void; // 에러 시 닫기 액션 지원
}>;

export function ModalBoundary({ pending, onClose, children }: ModalQueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 700, fontSize: 14 }}>데이터를 불러오지 못했어요.</div>
              <div style={{ marginBottom: 12, fontSize: 13, color: "var(--color-gray-700)" }}>{String((error as Error)?.message ?? "네트워크 오류가 발생했습니다.")}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button variant="ghost" color="gray-400" onClick={onClose}>
                  닫기
                </Button>
                <Button onClick={() => resetErrorBoundary()}>다시 시도</Button>
              </div>
            </div>
          )}
        >
          <Suspense fallback={pending}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
