import { useBoardListSuspense } from "@/entities/board/api/boardQueries";
import { useBoardCategoryListSuspense } from "@/entities/boardCategory/api/boardCategoryQueries";
import { useMemo } from "react";
import { buildGroups, selectBoards, selectCatMap } from "./transform";

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
        select: selectCatMap,
    });

    const boardQ = useBoardListSuspense<SidebarBoard[]>({
        select: selectBoards,
    });

    const data = useMemo<SidebarGroup[]>(
        () => buildGroups(catQ.data, boardQ.data),
        [catQ.data, boardQ.data]
    );

    const isFetching = catQ.isFetching || boardQ.isFetching;
    const refetch = async () => Promise.all([catQ.refetch(), boardQ.refetch()]);
    return { data, isFetching, refetch };
}

