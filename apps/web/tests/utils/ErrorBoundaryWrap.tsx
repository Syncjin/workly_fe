import React from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ErrorBoundaryWrapProps {
    children: React.ReactNode;
    onError?: (error: any) => void;
    /** 에러 시 화면에 표식(div data-testid=...)을 남겨 단정하기 위함 */
    errorTestId?: string; // e.g., "error"
}

/**
 * 테스트 전용 ErrorBoundary 래퍼
 * - fallback UI를 실제로 보여주지 않아도 됨
 * - 대신 errorTestId가 있으면 표식으로 렌더 (테스트 단정용)
 */
export const ErrorBoundaryWrap: React.FC<ErrorBoundaryWrapProps> = ({ children, onError, errorTestId }) => {
    return (
        <ErrorBoundary
            onError={onError}
            fallbackRender={({ error }) => {
                onError?.(error);
                return errorTestId ? <div data-testid={errorTestId} /> : null;
            }}
        >
            {children}
        </ErrorBoundary>
    );
};