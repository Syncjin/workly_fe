import { CommentReaction } from "@/entities/comment";
import { useCallback, useState } from "react";
import { ReactionUpsertResult, UseReactionUpsertProps } from "./types";
import { useCommentReactionDeleteAction } from "./useCommentReactionDeleteAction";
import { useCommentReactionUpsertAction } from "./useCommentReactionUpsertAction";

export function useReactionUpsert({ comment, onSuccess, onError }: UseReactionUpsertProps): ReactionUpsertResult {
  const [loading, setLoading] = useState(false);

  const upsertAction = useCommentReactionUpsertAction();
  const deleteAction = useCommentReactionDeleteAction();

  const handleReactionSelect = useCallback(
    async (reactionType: CommentReaction) => {
      if (!comment || !comment.commentId) {
        console.warn("Cannot select reaction: comment is null or missing commentId");
        return;
      }

      setLoading(true);

      try {
        // 현재 사용자의 반응과 같은 반응을 선택하면 삭제
        if (comment.myReaction === reactionType) {
          await deleteAction.run({ commentId: comment.commentId });
          onSuccess?.(undefined);
        } else {
          // 다른 반응이거나 반응이 없으면 추가/수정
          await upsertAction.run({
            commentId: comment.commentId,
            commentReaction: reactionType,
          });
          onSuccess?.(reactionType);
        }
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [comment?.commentId, comment?.myReaction, upsertAction, deleteAction, onSuccess, onError]
  );

  const isLoading = loading || upsertAction.isPending || deleteAction.isPending;

  return {
    handleReactionSelect,
    loading: isLoading,
  };
}
