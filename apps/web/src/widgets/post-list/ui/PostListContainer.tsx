import { BoardHeader, BoardHeaderBoundary, PostList, PostListBoundary, PostListToolbar, SelectionStoreProvider, usePostListScopeFromURL } from "@/widgets/post-list";
import * as styles from "./postList.css";

export const PostListContainer = () => {
  const { scopeKey, scope } = usePostListScopeFromURL();

  return (
    <div className={[styles.container].filter(Boolean).join(" ")}>
      <BoardHeaderBoundary>
        <BoardHeader boardId={scope.boardId} />
      </BoardHeaderBoundary>
      <SelectionStoreProvider scopeKey={scopeKey} resetOnScopeChange={true}>
        <PostListToolbar />
        <PostListBoundary>
          <PostList />
        </PostListBoundary>
      </SelectionStoreProvider>
    </div>
  );
};

PostListContainer.displayName = "PostListContainer";
