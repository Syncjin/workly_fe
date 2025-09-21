import { BoardHeader } from "@/widgets/post-list/ui/BoardHeader";
import { BoardHeaderBoundary } from "@/widgets/post-list/ui/BoardHeaderBoundary";
import { PostList } from "@/widgets/post-list/ui/PostList";
import { PostListBoundary } from "@/widgets/post-list/ui/PostListBoundary";
import { PostListToolbar } from "@/widgets/post-list/ui/PostListToolbar";
import * as styles from "./postList.css";

interface PostListContainerProps {
  boardId?: number;
  categoryId?: number;
}

export const PostListContainer = ({ boardId, categoryId }: PostListContainerProps) => {
  return (
    <div className={[styles.container].filter(Boolean).join(" ")}>
      <BoardHeaderBoundary>
        <BoardHeader boardId={boardId} />
      </BoardHeaderBoundary>
      {/* {posts?.[0]?.board?.boardName && <h1 className={styles.header}>{posts?.[0]?.board?.boardName ?? "게시판"}</h1>} */}
      <PostListToolbar />
      <PostListBoundary>
        <PostList />
      </PostListBoundary>
    </div>
  );
};

PostListContainer.displayName = "PostListContainer";
