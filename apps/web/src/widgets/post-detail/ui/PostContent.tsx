import { PERM, PermissionGate, usePermission } from "@/entities/permission";
import { Post } from "@/entities/post";
import { DeletePostButton, DeletePostRenderProps } from "@/features/post/post-delete";
import { log } from "@/lib/logger";
import { EditorViewer } from "@workly/editor";
import { Button } from "@workly/ui";
import Link from "next/link";
import { MouseEvent, useCallback, useMemo } from "react";
import * as styles from "./postDetail.css";

const PostContent = (post: Post) => {
  const initialJSON = useMemo(() => {
    try {
      return post?.content ? JSON.parse(post.content) : null;
    } catch {
      return null;
    }
  }, [post?.content]);
  const { isPermitted, isLoading, isError } = usePermission(PERM.POST_EDIT);

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (isLoading || isError || !isPermitted) e.preventDefault();
    },
    [isLoading, isError, isPermitted]
  );
  const disabled = isLoading || isError || !isPermitted;

  const renderOnDelete = useCallback(
    ({ run, isPending, isPermitted }: DeletePostRenderProps) => {
      if (!isPermitted) return null;
      const disabled = isPending;

      const onClick = async () => {
        if (disabled) return;
        try {
          await run();
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
      {initialJSON && (
        <>
          <EditorViewer namespace="post-viewer" initialJSON={initialJSON} contentClassName={styles.editorViewer} />
          <PermissionGate perm={PERM.POST_EDIT} fallback={null}>
            <Link href="/admin/board" onClick={onClick} aria-disabled={disabled || undefined} className={""}>
              수정
            </Link>
          </PermissionGate>
          <DeletePostButton postIds={[post.postId]}>{renderOnDelete}</DeletePostButton>
        </>
      )}
    </div>
  );
};

export default PostContent;
