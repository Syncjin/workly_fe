/**
 * 휴지통 액션 관리 훅
 */

import { usePostRestore, useTrashEmpty } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";

export const useTrashActions = () => {
  const queryClient = useQueryClient();

  // 게시글 복원 뮤테이션
  const restoreMutation = usePostRestore();

  // 휴지통 전체 비우기 뮤테이션 (영구 삭제)
  const emptyTrashMutation = useTrashEmpty();

  const handleRestore = (postIds: number[]) => {
    restoreMutation.mutate(
      { postId: postIds },
      {
        onSuccess: () => {
          // 휴지통 목록 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ["posts", "trash"] });
          // 일반 게시글 목록도 무효화 (복원된 게시글이 나타날 수 있음)
          queryClient.invalidateQueries({ queryKey: ["posts", "list"] });
        },
      }
    );
  };

  const handleEmptyTrash = () => {
    emptyTrashMutation.mutate(undefined, {
      onSuccess: () => {
        // 휴지통 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ["posts", "trash"] });
      },
    });
  };

  return {
    restore: handleRestore,
    emptyTrash: handleEmptyTrash,
    isRestoring: restoreMutation.isPending,
    isEmptyingTrash: emptyTrashMutation.isPending,
    isLoading: restoreMutation.isPending || emptyTrashMutation.isPending,
  };
};
