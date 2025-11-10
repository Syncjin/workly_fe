"use client";

import { useUnreadPostsSuspense } from "@/entities/post";
import Link from "next/link";
import { PostItem } from "./PostItem";
import * as styles from "./unreadSection.css";

interface UnreadSectionProps {
  maxItems?: number;
}

export function UnreadSection({ maxItems = 5 }: UnreadSectionProps) {
  const { data } = useUnreadPostsSuspense(
    { page: 1, size: maxItems },
    {
      staleTime: 5 * 60 * 1000, // 5분간 캐시
    }
  );

  const posts = data?.data?.items ?? [];
  const totalCount = data?.data?.totalItems ?? 0;

  if (posts.length === 0) {
    return null;
  }

  const showMoreLink = totalCount > maxItems;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>📖 안읽은 게시글</h2>
      <div className={styles.content}>
        {posts.map((post) => (
          <PostItem key={post.postId} post={post} />
        ))}
      </div>
      {showMoreLink && (
        <div className={styles.moreLinkWrapper}>
          <Link href="/board?filter=unread" className={styles.moreLink}>
            더보기 →
          </Link>
        </div>
      )}
    </section>
  );
}
