import type { Board } from "@/entities/board/model";
import type { BoardCategory } from "@/entities/boardCategory/model";
import { ApiResponse } from "@/shared/api/types";
import type { SidebarBoard, SidebarGroup } from "./useSidebarBoard";

export type CatMap = Record<number, { name: string; order: number }>;

export function buildCategoryMap(list: BoardCategory[]): CatMap {
  return (list ?? []).reduce<CatMap>((acc, c) => {
    acc[c.categoryId] = { name: c.categoryName, order: c.sortOrder ?? 0 };
    return acc;
  }, {});
}

export function normalizeAndSortBoards(list: Board[]): SidebarBoard[] {
  return (list ?? [])
    .map<SidebarBoard>((b) => ({
      id: b.boardId,
      name: b.boardName,
      order: b.sortOrder ?? 0,
      categoryId: b.categoryId ?? null,
    }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

/** 현재 구현: categoryId가 null이거나 존재하지 않는 카테고리는 스킵 */
export function buildGroups(catMap: CatMap, boards: SidebarBoard[]): SidebarGroup[] {
  const groups: SidebarGroup[] = Object.keys(catMap)
    .map((idStr) => {
      const id = Number(idStr);
      const meta = catMap[id];
      return { category: { id, name: meta.name, order: meta.order }, boards: [] as SidebarBoard[] };
    })
    .sort((a, b) => a.category.order - b.category.order || a.category.name.localeCompare(b.category.name));

  const idxByCatId = new Map<number, number>();
  for (let i = 0; i < groups.length; i++) idxByCatId.set(groups[i].category.id, i);

  for (const b of boards) {
    const cid = b.categoryId;
    if (cid == null) continue;
    const gi = idxByCatId.get(cid);
    if (gi == null) continue;
    groups[gi].boards.push(b);
  }

  return groups;
}

export const selectCatMap = (resp: ApiResponse<BoardCategory[]>) => buildCategoryMap(resp.data ?? []);

export const selectBoards = (resp: ApiResponse<Board[]>) => normalizeAndSortBoards(resp.data ?? []);
