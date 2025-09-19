"use client";
import { PostList } from "@/widgets/post-list/ui/PostList";
import { PostMain } from "@/widgets/post-list/ui/PostMain";
import { useSearchParams } from "next/navigation";

export const PostListGate = () => {
  const searchParams = useSearchParams();
  const boardId = searchParams?.get("boardId") ? Number(searchParams?.get("boardId")) : undefined;
  const categoryId = searchParams?.get("categoryId") ? Number(searchParams?.get("categoryId")) : undefined;
  const keyword: string | undefined = searchParams?.get("keyword")?.trim() || undefined;
  const size = searchParams?.get("size") ? Number(searchParams?.get("size")) : 10;
  const page = searchParams?.get("page") ? Number(searchParams?.get("page")) : 1;

  const isFetch = boardId && categoryId;

  if (!isFetch) {
    return <PostMain />;
  }

  return <PostList initialKeyword={keyword} initialBoardId={boardId} initialCategoryId={categoryId} initialPage={page} size={size} />;
};
