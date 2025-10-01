import { type PostListParams, usePostListSuspense } from "@/entities/post";
import { keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const usePostListParamsFromURL = () => {
  const searchParams = useSearchParams();

  const params = useMemo((): PostListParams => {
    const keyword = searchParams?.get("keyword")?.trim() || undefined;
    const boardId = searchParams?.get("boardId") ? Number(searchParams.get("boardId")) : undefined;
    const categoryId = searchParams?.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined;
    const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
    const size = searchParams?.get("size") ? Number(searchParams.get("size")) : 10;

    return {
      keyword,
      boardId,
      categoryId,
      page,
      size,
    };
  }, [searchParams]);

  return usePostListSuspense(params, {
    select: (resp) => resp.data,
    placeholderData: keepPreviousData,
  });
};
