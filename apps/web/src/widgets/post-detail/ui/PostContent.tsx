import { boardApi, boardQueryKeys } from "@/entities/board";
import { PERM, PermissionGate, usePermission } from "@/entities/permission";
import { Post } from "@/entities/post";
import { DeletePostButton, DeletePostRenderProps } from "@/features/post/post-delete";
import { log } from "@/lib/logger";
import { closeLoadingOverlay, openConfirm, openLoadingOverlay } from "@/shared/ui/modal/openers";
import { useQueryClient } from "@tanstack/react-query";
import { EditorViewer } from "@workly/editor";
import { Button } from "@workly/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback } from "react";
import * as styles from "./postDetail.css";

const PostContent = (post: Post) => {
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  const { isPermitted, isLoading, isError } = usePermission(PERM.POST_EDIT);

  const onClick = useCallback(() => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.set("boardId", String(post.board.boardId));
    sp.set("postId", String(post.postId));
    startTransition(() => {
      router.push(`/article/write?${sp.toString()}`, { scroll: false });
    });
  }, [post]);

  const disabled = isLoading || isError || !isPermitted;

  const renderOnDelete = useCallback(
    ({ run, isPending, isPermitted }: DeletePostRenderProps) => {
      if (!isPermitted) return null;
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
    [post]
  );

  return (
    <div className={styles.content}>
      {post?.content && (
        <>
          <EditorViewer namespace="post-viewer" initialJSON={post?.content ?? null} contentClassName={styles.editorViewer} />
          <div className={styles.actionArea}>
            <PermissionGate perm={PERM.POST_EDIT} fallback={null}>
              <Button variant="border" size="md" color="gray-300" disabled={disabled} loading={undefined} onClick={onClick}>
                수정
              </Button>
            </PermissionGate>
            <DeletePostButton postIds={[post.postId]}>{renderOnDelete}</DeletePostButton>
          </div>
        </>
      )}
    </div>
  );
};

export default PostContent;
