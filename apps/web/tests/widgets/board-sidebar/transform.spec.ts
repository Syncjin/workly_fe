import type { Board } from '@/entities/board/model';
import type { BoardCategory } from '@/entities/boardCategory/model';
import { buildCategoryMap, buildGroups, normalizeAndSortBoards } from '@/widgets/board-sidebar/model/transform';
import { describe, expect, it } from "vitest";

const cats: BoardCategory[] = [
    { categoryId: 2, categoryName: '자유게시판', sortOrder: 1 },
    { categoryId: 1, categoryName: '공지사항', sortOrder: 0 },
];

const boards: Board[] = [
    { boardId: 3, boardName: '속닥속닥', description: '', visibility: 'PUBLIC', sortOrder: 0, categoryId: 2, createdDateTime: '', updatedDateTime: '' },
    { boardId: 4, boardName: '공지 모음', description: '', visibility: 'PUBLIC', sortOrder: 0, categoryId: 1, createdDateTime: '', updatedDateTime: '' },
];

describe('transform utils (unit)', () => {
    it('buildCategoryMap', () => {
        const map = buildCategoryMap(cats);
        expect(map[1]).toEqual({ name: '공지사항', order: 0 });
        expect(map[2]).toEqual({ name: '자유게시판', order: 1 });
    });

    it('normalizeAndSortBoards: order ASC, tie -> name ASC', () => {
        const out = normalizeAndSortBoards([
            { ...boards[1] },                                                   // order 0
            { ...boards[0], boardId: 10, boardName: 'Z-끝', sortOrder: 1 },    // order 1
            { ...boards[0], boardId: 11, boardName: 'A-처음', sortOrder: 1 },  // order 1
        ]);
        expect(out.map(b => `${b.order}:${b.name}`)).toEqual(['0:공지 모음', '1:A-처음', '1:Z-끝']);
    });

    it('buildGroups: 카테고리 정렬 + 보드 배치', () => {
        const map = buildCategoryMap(cats);
        const norm = normalizeAndSortBoards(boards);
        const groups = buildGroups(map, norm);
        expect(groups.map(g => g.category.name)).toEqual(['공지사항', '자유게시판']);
        expect(groups[0].boards.map(b => b.name)).toEqual(['공지 모음']);
        expect(groups[1].boards.map(b => b.name)).toEqual(['속닥속닥']);
    });

    it('buildGroups: categoryId=null / 미존재 카테고리는 스킵', () => {
        const map = buildCategoryMap(cats);
        const norm = normalizeAndSortBoards([
            { ...boards[0], boardId: 100, boardName: '미분류', categoryId: null },
            { ...boards[0], boardId: 101, boardName: '유령', categoryId: undefined },
        ]);
        const groups = buildGroups(map, norm);
        expect(groups.every(g => g.boards.length === 0)).toBe(true);
    });
});