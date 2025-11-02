"use client";

import type { Post } from "@/entities/post";
import { PostListItem } from "@/entities/post";
import { formatDayOrTime } from "@/shared/lib";
import { useIsSelected, useSelectionActions, useSyncVisibleIds } from "@/widgets/post-list/model/SelectionStore";
import { useTrashPosts } from "@/widgets/trash-list/model/useTrashPosts";
import { Pagination } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import React, { memo, useCallback, useMemo } from "react";
import { TrashEmptyState } from "./TrashEmptyState";
import * as styles from "./trashList.css";

export const TrashList = React.memo(() => {
  const { data, isLoading } = useTrashPosts();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const handlePostClick = useCallback((item: Post) => {
    // 휴지통에서는 게시글 상세조회 불가능
    // 클릭 이벤트를 무시합니다
  }, []);

  if (isLoading) {
    return null; // 스켈레톤은 Boundary에서 처리
  }

  const isEmpty = posts.length === 0;

  if (isEmpty) {
    return (
      <div className={styles.listView}>
        <TrashEmptyState />
      </div>
    );
  }

  return (
    <div className={styles.listView}>
      {posts.map((post) => {
        return <TrashPostRow key={post.postId} post={post} onToggle={toggle} handlePostClick={handlePostClick} />;
      })}

      {posts.length > 0 && data?.data && data.data.totalPages > 1 && <Pagination pagination={data.data} onPageChange={handlePageChange} />}
    </div>
  );
});

TrashList.displayName = "TrashList";

const TrashPostRow = memo(({ post, onToggle, handlePostClick }: { post: Post; onToggle: (id: number, next?: boolean) => void; handlePostClick: (item: Post) => void }) => {
  const checked = useIsSelected(post.postId);

  const handleCheckedChange = useCallback((next: boolean) => onToggle(post.postId, next), [onToggle, post.postId]);

  return (
    <PostListItem.Root post={post} onCheckedChange={handleCheckedChange} checked={checked} selectable>
      <PostListItem.Left>
        <PostListItem.Check />
      </PostListItem.Left>
      <PostListItem.Center>
        <PostListItem.Title />
        <PostListItem.BottomContent />
        <PostListItem.DeletedDate />
      </PostListItem.Center>
      <PostListItem.Right>
        <PostListItem.Date>{formatDayOrTime(post.createdDateTime)}</PostListItem.Date>
      </PostListItem.Right>
    </PostListItem.Root>
  );
});

TrashPostRow.displayName = "TrashPostRow";
