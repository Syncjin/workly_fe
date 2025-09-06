/**
 * Board Category entity types
 *
 * 게시판 카테고리 도메인
 */

export interface BoardCategory {
    categoryId: number;
    categoryName: string;
    sortOrder: number;
}

export interface BoardCategoryListResponse {
    data: BoardCategory[];
}
