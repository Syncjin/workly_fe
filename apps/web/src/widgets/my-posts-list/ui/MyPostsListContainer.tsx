"use client";

import { SelectionStoreProvider } from "@/widgets/post-list/model/SelectionStore";
import { PostListBoundary } from "@/widgets/post-list/ui/PostListBoundary";
import { MyPostsHeader } from "./MyPostsHeader";
import { MyPostsList } from "./MyPostsList";
import * as styles from "./myPostsList.css";
import { MyPostsToolbar } from "./MyPostsToolbar";

/**
 * 내 게시글 페이지의 메인 컨테이너 컴포넌트
 *
 */
export const MyPostsListContainer = () => {
  return (
    <div className={styles.container}>
      <MyPostsHeader />
      <SelectionStoreProvider scopeKey="my-posts" resetOnScopeChange={true}>
        <MyPostsToolbar />
        <PostListBoundary>
          <MyPostsList />
        </PostListBoundary>
      </SelectionStoreProvider>
    </div>
  );
};

MyPostsListContainer.displayName = "MyPostsListContainer";
