import { Comment, CommentCreateRequest, commentQueryKeys, PageData, useCommentCreate } from "@/entities/comment";
import { User, usersQueryKeys } from "@/entities/users";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@workly/types";
import { useCallback } from "react";

export function useCommentCreateAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCommentCreate();

  const run = useCallback(
    async ({ content, postId, parentId }: CommentCreateRequest) => {
      // 관련 쿼리들을 취소하여 경쟁 상태 방지
      await qc.cancelQueries({ queryKey: commentQueryKeys.infiniteLists() });

      // 현재 데이터의 스냅샷 저장 (롤백용)
      const previousData = qc.getQueryData<InfiniteData<ApiResponse<PageData>>>(commentQueryKeys.infinite({ postId }));
      const previousUserData = qc.getQueryData<ApiResponse<User>>(usersQueryKeys.myInfo());

      const currentUser = previousUserData?.data;
      const fallbackUser: User = {
        id: Date.now(),
        userId: Date.now().toString(),
        name: "loading",
        birthDate: "",
        email: "",
        profile: "",
        description: "",
        positionId: 0,
        positionName: "",
        teamId: 0,
        teamName: "",
        status: "ACTIVE",
        role: "ROLE_USER",
        createdDateTime: new Date().toISOString(),
        updatedDateTime: new Date().toISOString(),
      };

      try {
        // 임시 데이터
        const tempComment: Comment = {
          commentId: Date.now(),
          content,
          user: currentUser || fallbackUser,
          postId,
          createdDateTime: new Date().toISOString(),
          updatedDateTime: new Date().toISOString(),
          deletedDateTime: undefined,
          reactions: undefined,
          myReaction: undefined,
        };

        qc.setQueryData<InfiniteData<ApiResponse<PageData>>>(commentQueryKeys.infinite({ postId }), (old) => {
          if (!old) return old;

          const newPages = [...old.pages];
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              data: {
                ...newPages[0].data,
                items: [...(newPages[0].data.items || []), tempComment],
                totalItems: (newPages[0].data.totalItems || 0) + 1,
              },
            };
          }

          return {
            ...old,
            pages: newPages,
          };
        });

        // return;
        const result = await mutateAsync({ content, postId, parentId });

        // 성공 시 실제 데이터로 교체
        qc.setQueryData<InfiniteData<ApiResponse<PageData>>>(commentQueryKeys.infinite({ postId }), (old) => {
          if (!old) return old;

          const newPages = [...old.pages];
          if (newPages[0]) {
            const items = newPages[0].data.items || [];
            // 임시 댓글을 실제 댓글로 교체
            const updatedItems = items.map((item) => (item.commentId === tempComment.commentId ? result.data : item));

            newPages[0] = {
              ...newPages[0],
              data: {
                ...newPages[0].data,
                items: updatedItems,
              },
            };
          }

          return {
            ...old,
            pages: newPages,
          };
        });

        return result;
      } catch (error) {
        // 롤백
        if (previousData) {
          qc.setQueryData(commentQueryKeys.infinite({ postId }), previousData);
        }
        throw error;
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
