import { PostList } from "@/widgets/post-list/ui/PostList";
import { PostListBoundary } from "@/widgets/post-list/ui/PostListBoundary";
import { PostListToolbar } from "@/widgets/post-list/ui/PostListToolbar";
import React from "react";
import * as styles from "./postList.css";

// 안정적인 파라미터만 포함하는 props 인터페이스
interface PostListContainerProps {
  boardId?: number;
  categoryId?: number;
}

// React.memo로 래핑하여 props 변경 시에만 리렌더링
export const PostListContainer = React.memo(({ boardId, categoryId }: PostListContainerProps) => {
  console.log("PostListContainer", { boardId, categoryId });
  return (
    <div className={[styles.container].filter(Boolean).join(" ")}>
      {/* {posts?.[0]?.board?.boardName && <h1 className={styles.header}>{posts?.[0]?.board?.boardName ?? "게시판"}</h1>} */}
      <PostListToolbar />
      <PostListBoundary>
        <PostList />
      </PostListBoundary>
    </div>
  );
});

PostListContainer.displayName = "PostListContainer";
