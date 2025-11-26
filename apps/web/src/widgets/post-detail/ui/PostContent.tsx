import { boardApi, boardQueryKeys } from "@/entities/board";
import { Post } from "@/entities/post";
import { DeletePostButton, DeletePostRenderProps } from "@/features/post/post-delete";
import { usePostReadAction } from "@/features/post/post-read";
import { UpdatePostButton, UpdatePostRenderProps } from "@/features/post/post-update";
import { log } from "@/lib/logger";
import { closeLoadingOverlay, openConfirm, openLoadingOverlay } from "@/shared/ui/modal/openers";
import { useQueryClient } from "@tanstack/react-query";
import { EditorViewer } from "@workly/editor";
import { Button } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef } from "react";
import * as styles from "./postDetail.css";

const PostContent = (post: Post) => {
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const { run } = usePostReadAction();
  const hasExecutedRead = useRef(false);

  const renderOnDelete = useCallback(
    ({ run, isPending }: DeletePostRenderProps) => {
      const disabled = isPending;

      const onClick = async () => {
        const res = await openConfirm({ header: "게시글 삭제", title: "게시글을 삭제하시겠습니까?", content: "삭제한 게시글은 휴지통에서 확인할 수 있습니다." });
        if (!res || disabled) return;
        try {
          openLoadingOverlay();
          await run();
          closeLoadingOverlay();

          const res = await qc.ensureQueryData({
            queryKey: boardQueryKeys.detail(post.board.boardId),
            queryFn: () => boardApi.getBoardById({ boardId: post.board.boardId }),
          });

          const sp = new URLSearchParams(searchParams?.toString() ?? "");
          sp.set("boardId", String(post.board.boardId));
          sp.set("categoryId", String(res.data.categoryId));
          startTransition(() => {
            router.push(`/board?${sp.toString()}`, { scroll: false });
          });
        } catch (e) {
          log.error("휴지통 이동 처리 실패", { error: e, op: "PostContent" });
        }
      };

      return (
        <Button variant="border" size="md" color="gray-300" disabled={disabled} loading={isPending || undefined} onClick={onClick}>
          삭제
        </Button>
      );
    },
    [post, qc, router, searchParams]
  );

  const handleUpdate = useCallback(() => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.set("boardId", String(post.board.boardId));
    sp.set("postId", String(post.postId));
    startTransition(() => {
      router.push(`/article/write?${sp.toString()}`, { scroll: false });
    });
  }, [post.board.boardId, post.postId, router, searchParams]);

  const renderOnUpdate = useCallback(
    ({ isPending, isError }: UpdatePostRenderProps) => {
      const disabled = isPending || isError;

      return (
        <Button variant="border" size="md" color="gray-300" disabled={disabled} loading={undefined} onClick={handleUpdate}>
          수정
        </Button>
      );
    },
    [handleUpdate]
  );

  useEffect(() => {
    if (post.isRead || hasExecutedRead.current) return;

    hasExecutedRead.current = true;

    const timer = setTimeout(() => {
      run([post.postId]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [post.isRead, post.postId, run]);

  useEffect(() => {
    hasExecutedRead.current = false;
  }, [post.postId]);

  return (
    <div className={styles.content}>
      {post?.content && (
        <>
          <EditorViewer namespace="post-viewer" initialJSON={post?.content ?? null} contentClassName={styles.editorViewer} />
          <div className={styles.actionArea}>
            <UpdatePostButton ownerId={post.user.userId}>{renderOnUpdate}</UpdatePostButton>
            <DeletePostButton ownerId={post.user.userId} postIds={[post.postId]}>
              {renderOnDelete}
            </DeletePostButton>
          </div>
        </>
      )}
    </div>
  );
};

export default PostContent;
