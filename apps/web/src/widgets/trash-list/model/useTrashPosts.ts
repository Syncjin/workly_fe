/**
 * 휴지통 게시글 데이터 관리 훅
 */

"use client";

import { useTrashPostsSuspense, type PageParams } from "@/entities/post";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useTrashPosts = () => {
  const searchParams = useSearchParams();

  const params = useMemo(
    (): PageParams => ({
      page: Number(searchParams?.get("page")) || 1,
      size: Number(searchParams?.get("size")) || 10,
    }),
    [searchParams]
  );

  return useTrashPostsSuspense(params);
};
