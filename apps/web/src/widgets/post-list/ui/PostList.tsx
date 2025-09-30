"use client";

import type { Post } from "@/entities/post";
import { PostListItem } from "@/entities/post";
import { usePostListParamsFromURL } from "@/widgets/post-list/model";
import { useIsSelected, useSelectionActions, useSyncVisibleIds } from "@/widgets/post-list/model/SelectionStore";
import { PostListSkeleton } from "@/widgets/post-list/ui/loading/PostListSkeleton";
import { Pagination } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import React, { memo, useCallback, useMemo } from "react";
import * as styles from "./postList.css";

export const PostList = React.memo(() => {
  const { data, isLoading } = usePostListParamsFromURL();
  const router = useRouter();
  const searchParams = useSearchParams();

  const posts: Post[] = useMemo(() => (Array.isArray(data?.items) ? (data.items as Post[]) : []), [data.items]);
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

  if (isLoading) {
    return <PostListSkeleton rows={10} />;
  }

  return (
    <div className={styles.listView}>
      {posts.map((post) => {
        return <PostRow key={post.postId} post={post} onToggle={toggle} />;
      })}

      {posts && <Pagination pagination={data} onPageChange={handlePageChange} />}
    </div>
  );
});

PostList.displayName = "PostList";

const PostRow = memo(({ post, onToggle }: { post: Post; onToggle: (id: number, next?: boolean) => void }) => {
  const checked = useIsSelected(post.postId);

  const handleCheckedChange = useCallback((next: boolean) => onToggle(post.postId, next), [onToggle, post.postId]);

  const handlePostClick = useCallback(() => {
    // TODO: 게시글 클릭 로직 구현
  }, []);

  return <PostListItem.Root post={post} onClick={handlePostClick} onCheckedChange={handleCheckedChange} checked={checked} selectable />;
});

PostRow.displayName = "PostRow";
