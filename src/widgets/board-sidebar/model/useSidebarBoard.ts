import { useBoardList } from "@/entities/board/api/boardQueries";
import { Board } from "@/entities/board/model";
import { useBoardCategoryList } from "@/entities/boardCategory/api/boardCategoryQueries";
import { BoardCategory } from "@/entities/boardCategory/model";
import { ApiResponse } from "@/shared/api/types";
import { useMemo } from "react";

export type SidebarBoard = {
    id: number;
    name: string;
    order: number;
    categoryId: number | null;
};

export type SidebarGroup = {
    category: { id: number; name: string; order: number };
    boards: SidebarBoard[];
};

export function useSidebarBoards() {

    // 1) 카테고리를 맵으로 변환
    const catQ = useBoardCategoryList<Record<number, { name: string; order: number }>>({
        select: (resp: ApiResponse<BoardCategory[]>) =>
            (resp.data ?? []).reduce<Record<number, { name: string; order: number }>>(
                (acc, c) => {
                    acc[c.categoryId] = { name: c.categoryName, order: c.sortOrder ?? 0 };
                    return acc;
                },
                {}
            ),
    });

    // 2) 보드를 사이드바용 최소 필드로 변환 + 1차 정렬(정렬 기준: sortOrder → boardName)
    const boardQ = useBoardList<SidebarBoard[]>({
        select: (resp: ApiResponse<Board[]>) =>
            (resp.data ?? [])
                .map((b) => ({
                    id: b.boardId,
                    name: b.boardName,
                    order: b.sortOrder ?? 0,
                    categoryId: b.categoryId ?? null,
                }))
                .sort(
                    (a, b) => a.order - b.order || a.name.localeCompare(b.name)
                ),
    });

    // 3) 그룹핑 + 최종 정렬(그룹: sortOrder → name, 보드: 위에서 정렬 완료)
    const data = useMemo<SidebarGroup[] | undefined>(() => {
        if (!catQ.data || !boardQ.data) return undefined;

        const catMap = catQ.data; // id -> { name, order }

        // (1) 카테고리로 빈 그룹 생성 → 정렬
        const groups: SidebarGroup[] = Object.keys(catMap)
            .map((idStr) => {
                const id = Number(idStr);
                const meta = catMap[id];
                return { category: { id, name: meta.name, order: meta.order }, boards: [] as SidebarBoard[] };
            })
            .sort(
                (a, b) =>
                    a.category.order - b.category.order ||
                    a.category.name.localeCompare(b.category.name)
            );

        // (2) 그룹 인덱스 빠른 접근용 맵
        const idxByCatId = new Map<number, number>();
        for (let i = 0; i < groups.length; i++) {
            idxByCatId.set(groups[i].category.id, i);
        }

        // (3) 유효한 카테고리에만 보드 할당
        for (const b of boardQ.data) {
            const cid = b.categoryId;
            if (cid == null) continue;
            const gi = idxByCatId.get(cid);
            if (gi == null) continue;
            groups[gi].boards.push(b);
        }

        return groups;
    }, [catQ.data, boardQ.data]);

    // 상태 합치기
    const isLoading = catQ.isLoading || boardQ.isLoading;
    const isFetching = catQ.isFetching || boardQ.isFetching;
    const error = catQ.error ?? boardQ.error;
    const isError = Boolean(error);
    const refetch = async () => {
        await Promise.all([catQ.refetch(), boardQ.refetch()]);
    };

    return { data, isLoading, isFetching, isError, error, refetch };
}

