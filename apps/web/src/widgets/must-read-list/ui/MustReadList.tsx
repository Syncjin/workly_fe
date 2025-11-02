"use client";

import { PageParams, Post, PostListItem, useMustReadPostsSuspense } from "@/entities/post";
import { Pagination } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { MustReadEmptyState } from "./MustReadEmptyState";
import * as styles from "./mustReadList.css";

export const MustReadList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params: PageParams = useMemo(
    () => ({
      page: Number(searchParams?.get("page")) || 1,
      size: Number(searchParams?.get("size")) || 10,
    }),
    [searchParams]
  );

  const { data, isLoading } = useMustReadPostsSuspense(params);

  const posts: Post[] = useMemo(() => (Array.isArray(data?.data?.items) ? (data.data.items as Post[]) : []), [data?.data?.items]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams || "");
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handlePostClick = useCallback(
    (item: Post) => {
      router.push(`/article/${item.postId}`);
    },
    [router]
  );

  if (isLoading) {
    return null; // 스켈레톤은 Boundary에서 처리
  }

  const isEmpty = posts.length === 0;

  if (isEmpty) {
    return (
      <div className={styles.listView}>
        <MustReadEmptyState />
      </div>
    );
  }

  return (
    <div className={styles.listView}>
      {posts.map((post) => {
        return <MustReadRow key={post.postId} post={post} handlePostClick={handlePostClick} />;
      })}

      {posts.length > 0 && data?.data && data.data.totalPages > 1 && <Pagination pagination={data.data} onPageChange={handlePageChange} />}
    </div>
  );
};

MustReadList.displayName = "MustReadList";

const MustReadRow = memo(({ post, handlePostClick }: { post: Post; handlePostClick: (item: Post) => void }) => {
  return (
    <PostListItem.Root post={post} onClick={() => handlePostClick(post)}>
      <PostListItem.Center>
        <PostListItem.Title />
        <PostListItem.BottomContent />
      </PostListItem.Center>
      <PostListItem.Right />
    </PostListItem.Root>
  );
});

MustReadRow.displayName = "MustReadRow";
