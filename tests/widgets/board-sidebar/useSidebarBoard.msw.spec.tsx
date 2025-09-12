import { boardSidebarHandlers } from '@/tests/msw/handlers/widgets.board-sidebar.handlers';
import { setScenario } from '@/tests/msw/server';
import { ErrorBoundaryWrap } from '@/tests/utils/ErrorBoundaryWrap';
import { withProviders } from '@/tests/utils/Providers';
import { SuspenseWrap } from '@/tests/utils/SuspenseWrap';
import { useSidebarBoardsSuspense } from '@/widgets/board-sidebar/model/useSidebarBoard';
import { renderHook, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

let capturedError: any = null;

const wrapper = ({ children }: { children: React.ReactNode }) =>
    withProviders(
        <ErrorBoundaryWrap errorTestId="error" onError={(err) => (capturedError = err)}>
            <SuspenseWrap>{children}</SuspenseWrap>
        </ErrorBoundaryWrap>
    );

describe('useSidebarBoard (MSW integration)', () => {
    it('로딩(fallback) → 데이터 정렬/배치', async () => {
        setScenario(boardSidebarHandlers.success);
        const { result } = renderHook(() => useSidebarBoardsSuspense(), { wrapper });
        expect(screen.getByTestId('loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(result.current.data.length).toBeGreaterThan(0);
        });

        expect(result.current.data.map(g => g.category.name)).toEqual(['공지사항', '자유게시판']);
        expect(result.current.data[0].boards.map(b => b.name)).toEqual(['공지 모음']);
        expect(result.current.data[1].boards.map(b => b.name)).toEqual(['속닥속닥']);
    });

    it('빈 데이터면 빈 배열', async () => {
        setScenario(boardSidebarHandlers.empty);
        const { result } = renderHook(() => useSidebarBoardsSuspense(), { wrapper });
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(result.current.data).toEqual([]);
        });
    });

    it('api 실패 시 에러 확인)', async () => {
        setScenario(boardSidebarHandlers.failed);

        renderHook(() => useSidebarBoardsSuspense(), { wrapper });

        await waitFor(() => {
            if (!capturedError) throw new Error("no error yet");
        });

        expect(capturedError).toMatchObject({
            message: "요청 파라미터가 올바르지 않습니다.",
            status: 400,
            code: "INVALID_REQUEST",
        });
    });
});
