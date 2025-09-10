import { server } from '@/tests/msw/server';
import { withProviders } from '@/tests/utils/Providers';
import { SuspenseWrap } from '@/tests/utils/SuspenseWrap';
import { useSidebarBoardsSuspense } from '@/widgets/board-sidebar/model/useSidebarBoard';
import { renderHook, screen, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) =>
    withProviders(<SuspenseWrap>{children}</SuspenseWrap>);

const categories_ok = {
    status: 200, code: 'OK', message: 'ok',
    data: [
        { categoryId: 2, categoryName: '자유게시판', sortOrder: 1 },
        { categoryId: 1, categoryName: '공지사항', sortOrder: 0 },
    ],
    timestamp: 't',
};
const boards_ok = {
    status: 200, code: 'OK', message: 'ok',
    data: [
        { boardId: 3, boardName: '속닥속닥', description: '', visibility: 'PUBLIC', sortOrder: 0, categoryId: 2, createdDateTime: '', updatedDateTime: '' },
        { boardId: 4, boardName: '공지 모음', description: '', visibility: 'PUBLIC', sortOrder: 0, categoryId: 1, createdDateTime: '', updatedDateTime: '' },
    ],
    timestamp: 't',
};

const success = [
    http.get('/api/board-category', async () => { await delay(10); return HttpResponse.json(categories_ok); }),
    http.get('/api/boards', async () => { await delay(10); return HttpResponse.json(boards_ok); }),
];
const empty = [
    http.get('/api/board-category', () => HttpResponse.json({ ...categories_ok, data: [] })),
    http.get('/api/boards', () => HttpResponse.json({ ...boards_ok, data: [] })),
];
const failBoards = [
    http.get('/api/board-category', () => HttpResponse.json(categories_ok)),
    http.get('/api/boards', () => HttpResponse.json({ message: 'fail' }, { status: 500 })),
];

beforeEach(() => { server.use(...success); });

describe('useSidebarBoard (MSW integration)', () => {
    it('로딩(fallback) → 데이터 정렬/배치', async () => {
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
        server.use(...empty);
        const { result } = renderHook(() => useSidebarBoardsSuspense(), { wrapper });
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(result.current.data).toEqual([]);
        });
    });

    it('boards 실패 시 훅이 에러 throw → 경계에서 처리(여기선 throw만 확인)', async () => {
        server.use(...failBoards);
        const { result } = renderHook(() => useSidebarBoardsSuspense(), { wrapper });
        await expect(
            waitFor(() => { void result.current; })
        ).rejects.toBeDefined();
    });
});
