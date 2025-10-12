import { Post } from "@/entities/post";
import { formatYMDHM } from "@/shared/lib/date/formatters";
import { Avatar } from "@workly/ui";
import { useMemo } from "react";
import * as styles from "./postDetailHeader.css";

const PostDetailHeader = (post: Post) => {
  const avatar = useMemo(() => {
    if (post.user.profile && post.user.profile !== "프로필 이미지가 없습니다. 이미지를 등록해주세요.") {
      return <Avatar src={post.user.profile} className={styles.avatar} size={"lg"} />;
    }
    return <Avatar className={styles.avatar} size={"lg"} />;
  }, [post.user.profile]);

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h3>{post.title}</h3>
        <div className={styles.checkStar}></div>
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
