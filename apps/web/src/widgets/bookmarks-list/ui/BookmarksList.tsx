"use client";

import { PageParams, Post, PostListItem, useBookmarkedPostsSuspense } from "@/entities/post";
import { usePostBookmarkAction } from "@/features/post";
import { formatDayOrTime } from "@/shared/lib";
import { Button, Icon, Pagination } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { BookmarksEmptyState } from "./BookmarksEmptyState";
import * as styles from "./bookmarksList.css";

export const BookmarksList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params: PageParams = useMemo(
    () => ({
      page: Number(searchParams?.get("page")) || 1,
      size: Number(searchParams?.get("size")) || 10,
    }),
    [searchParams]
  );
  const { run } = usePostBookmarkAction();
  const { data, isLoading } = useBookmarkedPostsSuspense(params);

  const posts: Post[] = useMemo(() => (Array.isArray(data?.data?.items) ? (data.data.items as Post[]) : []), [data?.data?.items]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams || "");
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handlePostClick = useCallback(
    (item: Post) => {
      router.push(`/article/${item.postId}`);
    },
    [router]
  );

  const bookmarkOnClick = useCallback(
    async (item: Post) => {
      if (!item.postId) return;
      await run(item.postId);
    },
    [run]
  );

  if (isLoading) {
    return null; // 스켈레톤은 Boundary에서 처리
  }

  const isEmpty = posts.length === 0;

  if (isEmpty) {
    return (
      <div className={styles.listView}>
        <BookmarksEmptyState />
      </div>
    );
  }

  return (
    <div className={styles.listView}>
      {posts.map((post) => {
        return <BookmarkRow key={post.postId} post={post} handlePostClick={handlePostClick} bookmarkOnClick={bookmarkOnClick} />;
      })}

      {posts.length > 0 && data?.data && data.data.totalPages > 1 && <Pagination pagination={data.data} onPageChange={handlePageChange} />}
    </div>
  );
};

BookmarksList.displayName = "BookmarksList";

const BookmarkRow = memo(({ post, handlePostClick, bookmarkOnClick }: { post: Post; handlePostClick: (item: Post) => void; bookmarkOnClick: (item: Post) => void }) => {
  return (
    <PostListItem.Root post={post} onClick={() => handlePostClick(post)}>
      <PostListItem.Center>
        <PostListItem.Title />
        <PostListItem.BottomContent />
      </PostListItem.Center>
      <PostListItem.Right>
        <PostListItem.Date>{formatDayOrTime(post.createdDateTime)}</PostListItem.Date>
        <Button
          variant="ghost"
          color="gray-700"
          onClick={(e) => {
            e.stopPropagation();
            bookmarkOnClick(post);
          }}
          size="sm"
        >
          <Icon name="star-line" color={"var(--color-brand-500)"} />
        </Button>
      </PostListItem.Right>
    </PostListItem.Root>
  );
});

BookmarkRow.displayName = "BookmarkRow";
