import { Post } from "@/entities/post";
import { usePostBookmarkAction } from "@/features/post";
import { formatYMDHM } from "@/shared/lib/format/date/formatters";
import { Avatar, Button, Icon } from "@workly/ui";
import { useCallback, useMemo, useState } from "react";
import * as styles from "./postDetailHeader.css";

const PostDetailHeader = (post: Post) => {
  const avatar = useMemo(() => {
    if (post.user.profile && post.user.profile !== "프로필 이미지가 없습니다. 이미지를 등록해주세요.") {
      return <Avatar src={post.user.profile} className={styles.avatar} size={"lg"} />;
    }
    return <Avatar className={styles.avatar} size={"lg"} />;
  }, [post.user.profile]);

  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const { run } = usePostBookmarkAction();

  const bookmarkOnClick = useCallback(async () => {
    if (!post.postId) return;
    const result = await run(post.postId);
    console.log("result", result);
    setIsBookmarked(result?.data.isBookmarked);
  }, [post.postId, run]);

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h3>{post.title}</h3>
        <Button variant="ghost" color="gray-700" onClick={bookmarkOnClick} size="sm">
          {isBookmarked ? <Icon name="star-fill" color={"var(--color-brand-500)"} /> : <Icon name="star-line" color={"var(--color-gray-500)"} />}
        </Button>
      </div>
      <div className={styles.headerArea}>
        {avatar}
        <span className={styles.name}>{post.user.name}</span>
        <span className={styles.date}>
          <em>{formatYMDHM(post.updatedDateTime)}</em>
        </span>
        <span className={styles.read}>{`읽음 ${post.readCount}`}</span>
      </div>
    </div>
  );
};

export default PostDetailHeader;
