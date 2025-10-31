"use client";

import type { Post } from "@/entities/post";
import { PostListItem } from "@/entities/post";
import { usePostFilterManager } from "@/features/post/post-filter";
import { usePostListParamsFromURL } from "@/widgets/post-list";
import { useIsSelected, useSelectionActions, useSyncVisibleIds } from "@/widgets/post-list/model/SelectionStore";
import { PostListSkeleton } from "@/widgets/post-list/ui/loading/PostListSkeleton";
import { PostListEmptyState } from "@/widgets/post-list/ui/PostListEmptyState";
import { Pagination } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import React, { memo, useCallback, useMemo } from "react";
import * as styles from "./postList.css";

export const PostList = React.memo(() => {
  const { data, isLoading } = usePostListParamsFromURL();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filter, setFilter } = usePostFilterManager();

  const posts: Post[] = useMemo(() => (Array.isArray(data?.items) ? (data.items as Post[]) : []), [data?.items]);
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
    console.log("item", item);
    router.push(`/article/${item.postId}`);
  }, []);

  const handleShowAll = useCallback(() => {
    setFilter("all");
  }, [setFilter]);

  if (isLoading) {
    return <PostListSkeleton rows={10} />;
  }

  const isEmpty = posts.length === 0;
  const isUnreadFilter = filter === "unread";
  const showEmptyState = isEmpty && isUnreadFilter;

  if (showEmptyState) {
    return (
      <div className={styles.listView}>
        <PostListEmptyState type="no-unread-posts" onShowAll={handleShowAll} />
      </div>
    );
  }

  return (
    <div className={styles.listView}>
      {posts.map((post) => {
        return <PostRow key={post.postId} post={post} onToggle={toggle} handlePostClick={handlePostClick} />;
      })}

      {posts.length > 0 && data && data.totalPages > 1 && <Pagination pagination={data} onPageChange={handlePageChange} />}
    </div>
  );
});

PostList.displayName = "PostList";

const PostRow = memo(({ post, onToggle, handlePostClick }: { post: Post; onToggle: (id: number, next?: boolean) => void; handlePostClick: (item: Post) => void }) => {
  const checked = useIsSelected(post.postId);

  const handleCheckedChange = useCallback((next: boolean) => onToggle(post.postId, next), [onToggle, post.postId]);

  return <PostListItem.Root post={post} onClick={() => handlePostClick(post)} onCheckedChange={handleCheckedChange} checked={checked} selectable />;
});

PostRow.displayName = "PostRow";
