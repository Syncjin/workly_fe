"use client";

import { useMustReadPostsSuspense } from "@/entities/post";
import Link from "next/link";
import { PostItem } from "./PostItem";
import * as styles from "./mustReadSection.css";

interface MustReadSectionProps {
  maxItems?: number;
}

export function MustReadSection({ maxItems = 5 }: MustReadSectionProps) {
  const { data } = useMustReadPostsSuspense(
    { page: 1, size: maxItems },
    {
      staleTime: 5 * 60 * 1000, // 5분간 캐시
    }
  );

  const posts = data?.data?.items ?? [];
  const totalCount = data?.data?.totalItems ?? 0;

  const showMoreLink = totalCount > maxItems;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>📌 필독 게시글</h2>
      <div className={styles.content}>{posts.length === 0 ? <div className={styles.emptyState}>등록된 필독 게시글이 없습니다</div> : posts.map((post) => <PostItem key={post.postId} post={post} />)}</div>
      {showMoreLink && (
        <div className={styles.moreLinkWrapper}>
          <Link href="/must-read" className={styles.moreLink}>
            더보기 →
          </Link>
        </div>
      )}
    </section>
  );
}
