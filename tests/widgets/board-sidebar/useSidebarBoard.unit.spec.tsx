import * as BoardModule from '@/entities/board/api/boardQueries';
import * as CatModule from '@/entities/boardCategory/api/boardCategoryQueries';
import { useSidebarBoardsSuspense } from '@/widgets/board-sidebar/model/useSidebarBoard';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/entities/boardCategory/api/boardCategoryQueries');
vi.mock('@/entities/board/api/boardQueries');

type CatMap = Record<number, { name: string; order: number }>;
type SidebarBoard = { id: number; name: string; order: number; categoryId: number | null };

const catMap: CatMap = {
    1: { name: '공지사항', order: 0 },
    2: { name: '자유게시판', order: 1 },
};

const boards: SidebarBoard[] = [
    { id: 4, name: '공지 모음', order: 0, categoryId: 1 },
    { id: 3, name: '속닥속닥', order: 0, categoryId: 2 },
];

// 테스트 편의를 위한 헬퍼 (vi.fn 사용)
function mockCats(
    data: CatMap,
    isFetching = false,
    refetch = vi.fn().mockResolvedValue(undefined)
) {
    // vi.mock으로 모듈을 목으로 만들었으니 mockReturnValue/Implementation 사용 가능
    (CatModule as any).useBoardCategoryListSuspense.mockReturnValue({
        data,
        isFetching,
        refetch,
    });
}

function mockBoards(
    data: SidebarBoard[],
    isFetching = false,
    refetch = vi.fn().mockResolvedValue(undefined)
) {
    (BoardModule as any).useBoardListSuspense.mockReturnValue({
        data,
        isFetching,
        refetch,
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useSidebarBoard (unit, deps mocked)', () => {
    it('그룹 정렬/배치', () => {
        mockCats(catMap);
        mockBoards(boards);

        const { result } = renderHook(() => useSidebarBoardsSuspense());

        expect(result.current.data.map((g) => g.category.name)).toEqual(['공지사항', '자유게시판']);
        expect(result.current.data[0].boards.map((b) => b.name)).toEqual(['공지 모음']);
        expect(result.current.data[1].boards.map((b) => b.name)).toEqual(['속닥속닥']);
    });

    it('isFetching은 하위 훅 OR', () => {
        mockCats(catMap, true);
        mockBoards(boards, false);
        const { result, rerender } = renderHook(() => useSidebarBoardsSuspense());
        expect(result.current.isFetching).toBe(true);

        mockCats(catMap, false);
        mockBoards(boards, true);
        rerender();
        expect(result.current.isFetching).toBe(true);

        mockCats(catMap, false);
        mockBoards(boards, false);
        rerender();
        expect(result.current.isFetching).toBe(false);
    });

    it('refetch는 두 refetch를 병렬 호출', async () => {
        const c = vi.fn().mockResolvedValue('ok1');
        const b = vi.fn().mockResolvedValue('ok2');

        mockCats(catMap, false, c);
        mockBoards(boards, false, b);

        const { result } = renderHook(() => useSidebarBoardsSuspense());

        await act(async () => {
            await result.current.refetch();
        });

        expect(c).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(1);
    });
});
