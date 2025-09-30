/**
 * Post search state management hook
 * Manages search state with improved URL synchronization and stability
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PostSearchState } from "./types";

export const usePostSearch = (initialKeyword?: string): PostSearchState => {
  const [keyword, setKeyword] = useState<string>(initialKeyword || "");

  // URL 변경 시 검색 상태 동기화 (한 방향으로만)
  useEffect(() => {
    if (initialKeyword !== undefined && initialKeyword !== keyword) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  const clearSearch = useCallback(() => {
    setKeyword("");
  }, []);

  const hasActiveSearch = useMemo(() => {
    return keyword.trim().length > 0;
  }, [keyword]);

  return {
    keyword,
    setKeyword,
    clearSearch,
    hasActiveSearch,
  };
};
