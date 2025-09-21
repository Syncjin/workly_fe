"use client";
import { PostListContainer } from "@/widgets/post-list/ui/PostListContainer";
import { PostMain } from "@/widgets/post-list/ui/PostMain";
import { useSearchParams } from "next/navigation";
import { memo, useMemo } from "react";

interface StableParams {
  boardId?: number;
  categoryId?: number;
}

export const PostListGate = memo(() => {
  const searchParams = useSearchParams();

  const boardIdParam = searchParams?.get("boardId");
  const categoryIdParam = searchParams?.get("categoryId");

  const stableParams = useMemo((): StableParams => {
    return {
      boardId: boardIdParam ? Number(boardIdParam) : undefined,
      categoryId: categoryIdParam ? Number(categoryIdParam) : undefined,
    };
  }, [boardIdParam, categoryIdParam]);

  const isFetch = useMemo(() => {
    return stableParams.boardId && stableParams.categoryId;
  }, [stableParams.boardId, stableParams.categoryId]);

  if (!isFetch) {
    return <PostMain />;
  }

  return <PostListContainer {...stableParams} />;
});

PostListGate.displayName = "PostListGate";
