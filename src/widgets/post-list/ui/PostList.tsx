"use client";

import type { Post } from "@/entities/post";
import { PostListItem } from "@/entities/post";
import { EmptyState } from "@/shared/ui/EmptyState";
import Icon from "@/shared/ui/Icon";
import { usePostListParamsFromURL } from "@/widgets/post-list/model";
import { PostListSkeleton } from "@/widgets/post-list/ui/loading/PostListSkeleton";
import React, { useCallback, useState } from "react";
import * as styles from "./postList.css";

export const PostList = React.memo(() => {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const isChecked = useCallback((id: number) => selected.has(id), [selected]);

  const { data, isLoading } = usePostListParamsFromURL();

  // Handle post card click
  const handlePostClick = (post: Post) => {};

  const handlePostCheck = useCallback((id: number, next: boolean) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (next) s.add(id);
      else s.delete(id);
      return s;
    });
  }, []);

  // const selectAll = useCallback(() => setSelected(new Set(posts.map((p) => p.postId))), [posts]);
  // const clearAll = useCallback(() => setSelected(new Set()), []);

  // Render controls section
  // const renderControls = () => (
  //   <div className={postListWidgetStyles.controls}>
  //     {showSearch && <PostSearch search={search} placeholder="게시글 검색..." className={postListWidgetStyles.searchControl} />}

  //     {showFilters && <PostFilters filters={filters} boardOptions={boardOptions} categoryOptions={categoryOptions} className={postListWidgetStyles.filtersControl} />}
  //   </div>
  // );

  // Loading state - show controls and skeleton
  if (isLoading) {
    return <PostListSkeleton rows={10} />;
  }

  const posts = Array.isArray(data?.items) ? data.items : [];

  // Empty state - no posts available
  if (posts.length === 0) {
    return (
      <div className={[styles.container].filter(Boolean).join(" ")}>
        {/* {(showSearch || showFilters) && renderControls()} */}
        <EmptyState title="등록된 게시글이 없습니다." description={"게시판에 공유할 글을 남겨보세요."} icon={<Icon name="file-list-line" size={{ width: 60, height: 60 }} color="gray-300" />} action={{ label: "글쓰기", onClick: () => {} }} />
      </div>
    );
  }

  // Success state - render controls and post cards
  return (
    <div className={styles.listView}>
      {posts.map((post) => (
        <PostListItem.Root key={post.postId} post={post} onClick={handlePostClick} onCheckedChange={(next) => handlePostCheck(post.postId, next)} checked={isChecked(post.postId)} />
      ))}
    </div>
  );
});

PostList.displayName = "PostList";
