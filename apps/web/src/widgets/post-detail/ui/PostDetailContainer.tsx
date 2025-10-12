"use client";
import { boardApi, boardQueryKeys } from "@/entities/board";
import { usePostDetail } from "@/widgets/post-detail/model";
import PostContent from "@/widgets/post-detail/ui/PostContent";
import PostDetailHeader from "@/widgets/post-detail/ui/PostDetailHeader";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback } from "react";
import * as styles from "./postDetail.css";

export const PostDetailContainer = ({ postId }: { postId: number }) => {
  const { data } = usePostDetail({ postId });
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  const handleBoardName = useCallback(async () => {
    if (!data) {
      return;
    }
    const res = await qc.ensureQueryData({
      queryKey: boardQueryKeys.detail(data.board.boardId),
      queryFn: () => boardApi.getBoardById({ boardId: data.board.boardId }),
    });
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.set("boardId", String(data.board.boardId));
    sp.set("categoryId", String(res.data.categoryId));
    startTransition(() => {
      router.push(`/board?${sp.toString()}`, { scroll: false });
    });
  }, [data.board.boardId]);

  return (
    <div className={styles.container}>
      <div className={styles.boardArea} onClick={handleBoardName}>
        <h2>{data.board.boardName}</h2>
      </div>
      <PostDetailHeader {...data} />
      <PostContent {...data} />
      <div className={styles.footer}></div>
    </div>
  );
};

PostDetailContainer.displayName = "PostDetailContainer";
