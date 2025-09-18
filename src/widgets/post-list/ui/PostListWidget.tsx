"use client";

import type { Post, PostListParams } from "@/entities/post";
import { PostListItem, PostListSkeleton, usePostListSuspense } from "@/entities/post";
import { PostSearch, usePostFilters, usePostSearch } from "@/features/post";
import { EmptyState } from "@/shared/ui/EmptyState";
import Icon from "@/shared/ui/Icon";
import React, { useCallback, useMemo, useState } from "react";
import { postListWidgetStyles } from "./postListWidget.css";

export interface PostListWidgetProps {
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

export const PostListWidget: React.FC<PostListWidgetProps> = ({ initialKeyword, initialBoardId, initialCategoryId, initialPage = 1, size, showFilters = true, showSearch = true, categoryOptions = [], onPostClick, className }) => {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const isChecked = useCallback((id: number) => selected.has(id), [selected]);

  // Initialize filters and search state
  const filters = usePostFilters({
    boardId: initialBoardId,
    categoryId: initialCategoryId,
  });

  const search = usePostSearch(initialKeyword);

  // Combine filters and search into API parameters
  const params: PostListParams = useMemo(() => {
    const searchKeyword = search.keyword.trim();
    return {
      ...(searchKeyword && { keyword: searchKeyword }),
      ...(filters.boardId && { boardId: filters.boardId }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(initialPage !== 1 && { page: initialPage }),
      ...(size && { size }),
    };
  }, [search.keyword, filters.boardId, filters.categoryId, initialPage, size]);

  // Fetch post data using the React Query hook
  const { data, isLoading, refetch } = usePostListSuspense(params);

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
  const renderControls = () => (
    <div className={postListWidgetStyles.controls}>
      {showSearch && <PostSearch search={search} placeholder="게시글 검색..." className={postListWidgetStyles.searchControl} />}

      {/* {showFilters && <PostFilters filters={filters} boardOptions={boardOptions} categoryOptions={categoryOptions} className={postListWidgetStyles.filtersControl} />} */}
    </div>
  );

  // Loading state - show controls and skeleton
  if (isLoading) {
    return (
      <div className={[postListWidgetStyles.container, className].filter(Boolean).join(" ")}>
        {(showSearch || showFilters) && renderControls()}
        <PostListSkeleton rows={10} />
      </div>
    );
  }

  // const posts = Array.isArray(data?.data?.items) ? data.data.items : [];
  const posts: Post[] = [
    {
      postId: 0,
      title: "string",
      content: "string",
      board: {
        boardId: 0,
        boardName: "string",
      },
      fileInfos: [
        {
          fileId: "string",
          fileUrl: "string",
          objectKey: "string",
          originalFilename: "string",
          size: 0,
          contentType: "string",
          uploadedAt: "2025-09-16T11:10:45.782Z",
        },
      ],
      commentsCount: 0,
      likesCount: 0,
      createdDateTime: "2025-09-16T11:10:45.782Z",
      updatedDateTime: "2025-09-16T11:10:45.782Z",
      deletedDateTime: "2025-09-16T11:10:45.782Z",
      trashedDateTime: "2025-09-16T11:10:45.782Z",
      user: {
        id: 0,
        userId: "string",
        name: "string",
        birthDate: "2025-09-16",
        email: "string",
        profile: "string",
        description: "string",
        positionId: 0,
        positionName: "string",
        teamId: 0,
        teamName: "string",
        status: "ACTIVE",
        role: "ROLE_ADMIN",
        createdDateTime: "2025-09-16T11:10:45.782Z",
        updatedDateTime: "2025-09-16T11:10:45.782Z",
      },
      isLiked: true,
      isBookmarked: true,
      mustRead: true,
      isRead: true,
      readCount: 0,
    },
  ];

  // Empty state - no posts available
  if (posts.length === 0) {
    return (
      <div className={[postListWidgetStyles.container, className].filter(Boolean).join(" ")}>
        {/* {(showSearch || showFilters) && renderControls()} */}
        <EmptyState title="등록된 게시글이 없습니다." description={"게시판에 공유할 글을 남겨보세요."} icon={<Icon name="file-text-fill" size={{ width: 60, height: 60 }} color="gray-300" />} action={{ label: "글쓰기", onClick: () => {} }} />
      </div>
    );
  }

  // Success state - render controls and post cards
  return (
    <div className={[postListWidgetStyles.container, className].filter(Boolean).join(" ")}>
      {/* Filters and Search Controls */}
      {/* {(showSearch || showFilters) && renderControls()} */}

      {/* Post Grid */}
      <div className={postListWidgetStyles.listView}>
        {posts.map((post) => (
          <PostListItem.Root key={post.postId} post={post} onClick={handlePostClick} onCheckedChange={(next) => handlePostCheck(post.postId, next)} checked={isChecked(post.postId)} />
        ))}
      </div>
    </div>
  );
};
