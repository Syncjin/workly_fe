export interface BoardCategoryDTO {
  categoryId: number;
  categoryName: string;
  sortOrder: number;
}

export type BoardCategoryListResponse = BoardCategoryDTO[];
