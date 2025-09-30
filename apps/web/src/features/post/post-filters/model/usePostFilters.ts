/**
 * Post filters state management hook
 */

import { useMemo, useState } from "react";
import type { PostFilters, PostFiltersState } from "./types";

export const usePostFilters = (initialFilters?: PostFilters): PostFiltersState => {
  const [boardId, setBoardId] = useState<number | undefined>(initialFilters?.boardId);
  const [categoryId, setCategoryId] = useState<number | undefined>(initialFilters?.categoryId);

  const clearFilters = () => {
    setBoardId(undefined);
    setCategoryId(undefined);
  };

  const hasActiveFilters = useMemo(() => {
    return boardId !== undefined || categoryId !== undefined;
  }, [boardId, categoryId]);

  return {
    boardId,
    categoryId,
    setBoardId,
    setCategoryId,
    clearFilters,
    hasActiveFilters,
  };
};
