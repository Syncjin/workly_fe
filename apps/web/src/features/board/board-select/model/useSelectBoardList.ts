import { useBoardListSuspense } from "@/entities/board/api/boardQueries";
import { useBoardCategoryListSuspense } from "@/entities/boardCategory/api/boardCategoryQueries";
import { useMemo } from "react";
import { buildGroups, CatMap, selectBoards, selectCatMap } from "./transform";

export type SelectBoard = {
  id: number;
  name: string;
  order: number;
  categoryId: number | null;
};

export type SelectCategory = {
  id: number;
  name: string;
  order: number;
};

export type SelectBoardGroup = {
  category: SelectCategory;
  boards: SelectBoard[];
};

export function useSelectBoardList() {
  const catQ = useBoardCategoryListSuspense<Record<number, { name: string; order: number }>>({
    select: selectCatMap,
  });

  const boardQ = useBoardListSuspense<SelectBoard[]>(undefined, {
    select: selectBoards,
  });

  const data = useMemo<SelectBoardGroup[]>(() => buildGroups(catQ.data as CatMap, boardQ.data as SelectBoard[]), [catQ.data, boardQ.data]);

  const isFetching = catQ.isFetching || boardQ.isFetching;
  const refetch = async () => Promise.all([catQ.refetch(), boardQ.refetch()]);
  return { data, isFetching, refetch };
}
