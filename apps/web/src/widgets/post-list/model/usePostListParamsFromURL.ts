"use client";

import { type PostListParams, usePostListSuspense, usePostUnreadList } from "@/entities/post";
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
    const size = searchParams?.get("size") ? Number(searchParams.get("size")) : 20;
    const filter = (searchParams?.get("filter") as "all" | "unread") || "all";

    return {
      keyword,
      boardId,
      categoryId,
      page,
      size,
      filter,
    };
  }, [searchParams]);

  const isUnreadFilter = params.filter === "unread";

  const allPostsQuery = usePostListSuspense(params, {
    select: (resp) => resp.data,
    placeholderData: keepPreviousData,
    enabled: !isUnreadFilter,
  });

  const unreadPostsQuery = usePostUnreadList(params, {
    select: (resp) => resp.data,
    placeholderData: keepPreviousData,
    enabled: isUnreadFilter,
  });

  return isUnreadFilter ? unreadPostsQuery : allPostsQuery;
};
