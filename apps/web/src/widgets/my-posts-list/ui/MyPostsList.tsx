"use client";

import type { PageParams, Post } from "@/entities/post";
import { PostListItem } from "@/entities/post";
import { useMyPostsSuspense } from "@/entities/post/api/postQueries";
import { formatDayOrTime } from "@/shared/lib";
import { MyPostsEmptyState } from "@/widgets/my-posts-list/ui/MyPostsEmptyState";
import { useIsSelected, useSelectionActions, useSyncVisibleIds } from "@/widgets/post-list/model/SelectionStore";
import { Pagination } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import React, { memo, useCallback, useMemo } from "react";
import * as styles from "./myPostsList.css";

/**
 * 내 게시글 목록을 표시하는 컴포넌트
 *
 * 현재 사용자가 작성한 게시글만 표시하며, 작성자 정보는 숨깁니다.
 */
export const MyPostsList = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params: PageParams = useMemo(
    () => ({
      page: Number(searchParams?.get("page")) || 1,
      size: Number(searchParams?.get("size")) || 10,
    }),
    [searchParams]
  );

  const { data, isLoading } = useMyPostsSuspense(params);

  const posts: Post[] = useMemo(() => (Array.isArray(data?.data?.items) ? (data.data.items as Post[]) : []), [data?.data?.items]);
  const visibleIds = useMemo(() => posts.map((p) => p.postId), [posts]);

  useSyncVisibleIds(visibleIds);

  const { toggle } = useSelectionActions();

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

  if (isLoading) {
    return null; // 스켈레톤은 Boundary에서 처리
  }

  const isEmpty = posts.length === 0;

  if (isEmpty) {
    return (
      <div className={styles.listView}>
        <MyPostsEmptyState />
      </div>
    );
  }

  return (
    <div className={styles.listView}>
      {posts.map((post) => {
        return <MyPostRow key={post.postId} post={post} onToggle={toggle} handlePostClick={handlePostClick} />;
      })}

      {posts.length > 0 && data?.data && data.data.totalPages > 1 && <Pagination pagination={data.data} onPageChange={handlePageChange} />}
    </div>
  );
});

MyPostsList.displayName = "MyPostsList";

const MyPostRow = memo(({ post, onToggle, handlePostClick }: { post: Post; onToggle: (id: number, next?: boolean) => void; handlePostClick: (item: Post) => void }) => {
  const checked = useIsSelected(post.postId);

  const handleCheckedChange = useCallback((next: boolean) => onToggle(post.postId, next), [onToggle, post.postId]);

  return (
    <PostListItem.Root post={post} onClick={() => handlePostClick(post)} onCheckedChange={handleCheckedChange} checked={checked} selectable>
      <PostListItem.Left>
        <PostListItem.Check />
      </PostListItem.Left>
      <PostListItem.Center>
        <PostListItem.Title />
        <PostListItem.BottomContentWithoutAuthor />
      </PostListItem.Center>
      <PostListItem.Right>
        <PostListItem.Date>{formatDayOrTime(post.createdDateTime)}</PostListItem.Date>
      </PostListItem.Right>
    </PostListItem.Root>
  );
});

MyPostRow.displayName = "MyPostRow";
