import { SelectionStoreProvider } from "@/widgets/post-list/model/SelectionStore";
import { usePostListScopeFromURL } from "@/widgets/post-list/model/usePostListScopeFromUrl";
import { BoardHeader } from "@/widgets/post-list/ui/BoardHeader";
import { BoardHeaderBoundary } from "@/widgets/post-list/ui/BoardHeaderBoundary";
import { PostList } from "@/widgets/post-list/ui/PostList";
import { PostListBoundary } from "@/widgets/post-list/ui/PostListBoundary";
import { PostListToolbar } from "@/widgets/post-list/ui/PostListToolbar";
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
