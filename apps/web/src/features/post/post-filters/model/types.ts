/**
 * Post filters types and interfaces
 */

export interface PostFilters {
  /** Filter by board ID */
  boardId?: number;
  /** Filter by category ID */
  categoryId?: number;
}

export interface PostFiltersState extends PostFilters {
  /** Set board filter */
  setBoardId: (boardId?: number) => void;
  /** Set category filter */
  setCategoryId: (categoryId?: number) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Check if any filters are active */
  hasActiveFilters: boolean;
}
