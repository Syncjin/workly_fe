"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function usePostListScopeFromURL() {
  const sp = useSearchParams();

  // 스코프 객체와 키를 메모이제이션하여 불필요한 재계산 방지
  const { scope, scopeKey } = useMemo(() => {
    const scope = {
      boardId: sp?.get("boardId") ? Number(sp.get("boardId")) : null,
      categoryId: sp?.get("categoryId") ? Number(sp.get("categoryId")) : null,
      keyword: sp?.get("keyword")?.trim() || "",
    };
    const scopeKey = JSON.stringify(scope);

    return { scope, scopeKey };
  }, [sp]);

  return { scopeKey, scope };
}
