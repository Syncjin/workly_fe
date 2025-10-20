"use client";

import { Comment, CommentItem, useCommentListInfinite } from "@/entities/comment";
import * as itemStyles from "@/entities/comment/ui/commentItem.css";
import { CommentUpdate, UpdateCommentButton, UpdateCommentRenderProps } from "@/features/comment/comment-update";
import { useCommentThreadActions } from "@/widgets/comment-thread/model";
import { Button, Dropdown, Icon } from "@workly/ui";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import * as styles from "./commentList.css";

const RightMenu = ({ comment, setEditingId }: { comment: Comment; setEditingId: Dispatch<SetStateAction<number | null>> }) => {
  const renderOnUpdate = useCallback(
    ({ isPending, isError }: UpdateCommentRenderProps) => {
      const disabled = isPending || isError;

      const onClick = useCallback(() => {
        console.log("comment edit", comment);
        setEditingId(comment.commentId);
      }, [comment]);

      return <Dropdown.Item text="수정" onClick={onClick} />;
    },
    [comment]
  );

  return (
    <Dropdown align="end" classes={{ menu: styles.menu, item: styles.menuItem }}>
      <Dropdown.Trigger>
        <button className={styles.iconButton}>
          <Icon name="more-2-line" size={{ width: 16, height: 16 }} />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <UpdateCommentButton ownerId={comment.user.userId}>{renderOnUpdate}</UpdateCommentButton>
        <Dropdown.Item text="삭제" onClick={() => console.log("settings")} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const CommentList = ({ postId }: { postId: number }) => {
  const { setCommentCnt } = useCommentThreadActions();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useCommentListInfinite({ postId });

  const items = data?.pages.flatMap((page) => page.data.items ?? []) ?? [];
  const [editingId, setEditingId] = useState<number | null>(null);

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
      {items.map((comment) => {
        const isEditing = editingId === comment.commentId;
        if (!isEditing) {
          return <CommentItem.Root key={comment.commentId} comment={comment} right={<RightMenu comment={comment} setEditingId={setEditingId} />} />;
        }
        return (
          <CommentItem.Root key={comment.commentId} comment={comment}>
            <CommentItem.Profile />
            <div className={itemStyles.main}>
              <CommentItem.HeaderSlot />
              <CommentItem.ContentSlot>
                <CommentUpdate postId={comment.postId} comment={comment} onCancel={() => setEditingId(null)} />
              </CommentItem.ContentSlot>
            </div>
          </CommentItem.Root>
        );
      })}

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
