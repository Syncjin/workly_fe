import { BoardDescription } from "./BoardDescription";
import { MustReadSection } from "./MustReadSection";
import { PostSectionBoundary } from "./PostSectionBoundary";
import { UnreadSection } from "./UnreadSection";
import * as styles from "./postList.css";

export const PostMain = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>게시판</h1>

      <BoardDescription />

      <PostSectionBoundary skeletonCount={3}>
        <MustReadSection />
      </PostSectionBoundary>

      <PostSectionBoundary skeletonCount={3}>
        <UnreadSection />
      </PostSectionBoundary>
    </div>
  );
};
