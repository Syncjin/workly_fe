"use client";

import type { Post, PostListParams } from "@/entities/post";
import { PostListItem, usePostListSuspense } from "@/entities/post";
import { usePostFilters, usePostSearch } from "@/features/post";
import { EmptyState } from "@/shared/ui/EmptyState";
import Icon from "@/shared/ui/Icon";
import { PostListToolbar } from "@/widgets/post-list/ui/PostListToolbar";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import * as styles from "./postList.css";

export interface PostListProps {
  initialKeyword?: string;
  initialBoardId?: number;
  initialCategoryId?: number;
  initialPage?: number;
  size?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  categoryOptions?: Array<{ value: number; text: string }>;
  onPostClick?: (post: Post) => void;
  className?: string;
}

export const PostList: React.FC<PostListProps> = ({ initialKeyword, initialBoardId, initialCategoryId, initialPage = 1, size, showFilters = true, showSearch = true, categoryOptions = [], onPostClick, className }) => {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const isChecked = useCallback((id: number) => selected.has(id), [selected]);

  const queryParams = useSearchParams();

  // Initialize filters and search state
  const filters = usePostFilters({
    boardId: initialBoardId,
    categoryId: initialCategoryId,
  });

  const search = usePostSearch(initialKeyword);

  // Combine filters and search into API parameters
  const params: PostListParams = useMemo(() => {
    const searchKeyword = search.keyword.trim();
    const boardId = queryParams?.get("boardId");
    const categoryId = queryParams?.get("categoryId");
    return {
      ...(searchKeyword && { keyword: searchKeyword }),
      ...(boardId && { boardId: Number(boardId) }),
      ...(categoryId && { categoryId: Number(categoryId) }),
      ...(initialPage !== 1 && { page: initialPage }),
      ...(size && { size }),
    };
  }, [search.keyword, queryParams, initialPage, size]);

  // Fetch post data using the React Query hook
  const { data, isLoading, refetch } = usePostListSuspense(params, { select: (resp) => resp.data });

  // Handle post card click
  const handlePostClick = (post: Post) => {
    onPostClick?.(post);
  };

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
  // if (isLoading) {
  //   return (
  //     <div className={[styles.container, className].filter(Boolean).join(" ")}>
  //       {(showSearch || showFilters) && renderControls()}
  //       <PostListSkeleton rows={10} />
  //     </div>
  //   );
  // }

  const posts = Array.isArray(data?.items) ? data.items : [];

  // Empty state - no posts available
  if (posts.length === 0) {
    return (
      <div className={[styles.container, className].filter(Boolean).join(" ")}>
        {/* {(showSearch || showFilters) && renderControls()} */}
        <EmptyState title="등록된 게시글이 없습니다." description={"게시판에 공유할 글을 남겨보세요."} icon={<Icon name="file-text-fill" size={{ width: 60, height: 60 }} color="gray-300" />} action={{ label: "글쓰기", onClick: () => {} }} />
      </div>
    );
  }

  // Success state - render controls and post cards
  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      {posts?.[0]?.board?.boardName && <h1 className={styles.header}>{posts?.[0]?.board?.boardName ?? "게시판"}</h1>}
      <PostListToolbar />
      <div className={styles.listView}>
        {posts.map((post) => (
          <PostListItem.Root key={post.postId} post={post} onClick={handlePostClick} onCheckedChange={(next) => handlePostCheck(post.postId, next)} checked={isChecked(post.postId)} />
        ))}
      </div>
    </div>
  );
};
