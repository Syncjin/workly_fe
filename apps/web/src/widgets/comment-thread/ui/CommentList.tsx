"use client";

import { CommentItem, useCommentListInfinite } from "@/entities/comment";
import { useCommentThreadActions } from "@/widgets/comment-thread/model";
import { Button, Dropdown, Icon } from "@workly/ui";
import { useEffect, useRef } from "react";
import * as styles from "./commentList.css";

const RightMenu = () => {
  return (
    <Dropdown align="end" classes={{ menu: styles.menu, item: styles.menuItem }}>
      <Dropdown.Trigger>
        <button className={styles.iconButton}>
          <Icon name="more-2-line" size={{ width: 16, height: 16 }} />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Item text="수정" onClick={() => console.log("profile")} />
        <Dropdown.Item text="삭제" onClick={() => console.log("settings")} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const CommentList = ({ postId }: { postId: number }) => {
  const { setCommentCnt } = useCommentThreadActions();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useCommentListInfinite({ postId });

  const items = data?.pages.flatMap((page) => page.data.items ?? []) ?? [];
  const bottomRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const el = bottomRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });

    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const totalCnt = data?.pages?.[0]?.data?.totalItems;
    if (totalCnt) {
      setCommentCnt(totalCnt);
    }
  }, [data]);

  if (!isPending && items.length === 0) {
    return null;
  }
  return (
    <ul className={styles.container}>
      {items.map((comment) => (
        <CommentItem.Root key={comment.commentId} comment={comment} right={<RightMenu />} />
      ))}

      {hasNextPage && (
        <li ref={bottomRef} className={styles.loadMore}>
          <Button variant="ghost" loading={isFetchingNextPage} loadingIcon={<Icon name="loader-2-line" color="var(--color-brand-500)" />}>
            {isFetchingNextPage ? "" : "더 보기"}
          </Button>
        </li>
      )}
    </ul>
  );
};

CommentList.displayName = "CommentList";
