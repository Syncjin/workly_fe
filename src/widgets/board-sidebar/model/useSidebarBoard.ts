import { useBoardListSuspense } from "@/entities/board/api/boardQueries";
import { Board } from "@/entities/board/model";
import { useBoardCategoryListSuspense } from "@/entities/boardCategory/api/boardCategoryQueries";
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

export function useSidebarBoardsSuspense() {
    const catQ = useBoardCategoryListSuspense<Record<number, { name: string; order: number }>>({
        select: (resp: ApiResponse<BoardCategory[]>) =>
            (resp.data ?? []).reduce<Record<number, { name: string; order: number }>>(
                (acc, c) => {
                    acc[c.categoryId] = { name: c.categoryName, order: c.sortOrder ?? 0 };
                    return acc;
                },
                {}
            ),
    });

    const boardQ = useBoardListSuspense<SidebarBoard[]>({
        select: (resp: ApiResponse<Board[]>) =>
            (resp.data ?? [])
                .map((b) => ({
                    id: b.boardId,
                    name: b.boardName,
                    order: b.sortOrder ?? 0,
                    categoryId: b.categoryId ?? null,
                }))
                .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    });

    const data = useMemo<SidebarGroup[]>(() => {
        const catMap = catQ.data; // id -> { name, order }

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

        const idxByCatId = new Map<number, number>();
        for (let i = 0; i < groups.length; i++) idxByCatId.set(groups[i].category.id, i);

        for (const b of boardQ.data) {
            const cid = b.categoryId;
            if (cid == null) continue;
            const gi = idxByCatId.get(cid);
            if (gi == null) continue;
            groups[gi].boards.push(b);
        }

        return groups;
    }, [catQ.data, boardQ.data]);

    const isFetching = catQ.isFetching || boardQ.isFetching;
    const refetch = async () => Promise.all([catQ.refetch(), boardQ.refetch()]);
    return { data, isFetching, refetch };
}

