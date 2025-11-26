"use client";

import { EmptyTrashButton, type EmptyTrashRenderProps } from "@/features/post/post-delete";
import { PageSizeSelector, usePageSizeManager } from "@/features/post/post-filter";
import { RestoreButton, type RestoreRenderProps } from "@/features/post/post-restore";
import { log } from "@/lib/logger";
import { openBoardSelect, openConfirm } from "@/shared/ui/modal/openers";
import { usePageSelectionMeta, useSelectedPostIdsOnPage, useSelectionActions } from "@/widgets/post-list";
import { Button, CheckBox } from "@workly/ui";
import { useRouter } from "next/navigation";
import React, { startTransition, useCallback } from "react";
import { toolbar } from "./trashList.css";

export const TrashToolbar = React.memo(() => {
  const { pageSize, setPageSize } = usePageSizeManager();
  const { isAllCheck, isIndeterminateOnPage, totalSelected, total } = usePageSelectionMeta();
  const { selectAllVisible, clearVisible } = useSelectionActions();
  const postIds = useSelectedPostIdsOnPage();
  const router = useRouter();

  const isTrashEmpty = total === 0;

  const onAllCheckChange = useCallback(() => {
    if (isAllCheck) {
      clearVisible();
    } else {
      selectAllVisible();
    }
  }, [isAllCheck, selectAllVisible, clearVisible]);

  const hasSelectedItems = totalSelected > 0;

  const renderOnRestore = useCallback(
    ({ run, isPending }: RestoreRenderProps) => {
      const disabled = !hasSelectedItems || isPending;

      const onClick = async () => {
        if (disabled) return;

        if (postIds.length === 0) {
          log.warn("복원할 게시글이 선택되지 않음", { op: "RestoreToolbarButton" });
          return;
        }

        try {
          const res = await openBoardSelect();
          const boardId = res?.board?.id;
          const categoryId = res?.board?.categoryId;
          if (!boardId) return;

          await run(boardId);
          clearVisible();
          log.info("게시글 복원 완료", { postIds, count: postIds.length, boardId, op: "RestoreToolbarButton" });

          // 복원된 게시판으로 이동
          startTransition(() => {
            const params = new URLSearchParams();
            params.set("boardId", String(boardId));
            if (categoryId) {
              params.set("categoryId", String(categoryId));
            }
            router.push(`/board?${params.toString()}`);
          });
        } catch (e) {
          log.error("게시글 복원 처리 실패", { error: e, postIds, op: "RestoreToolbarButton" });
        }
      };

      return (
        <Button variant="border" size="sm" color="gray-300" disabled={disabled} loading={isPending || undefined} onClick={onClick}>
          이동
        </Button>
      );
    },
    [hasSelectedItems, clearVisible, postIds, router]
  );

  const renderOnEmptyTrash = useCallback(
    ({ run, isPending }: EmptyTrashRenderProps) => {
      const disabled = isTrashEmpty || isPending;

      const onClick = async () => {
        if (disabled) return;

        try {
          const res = await openConfirm({
            header: "휴지통 비우기",
            title: "휴지통을 완전히 비우시겠습니까?",
            content: "모든 게시글이 영구 삭제되며 복구할 수 없습니다.",
          });
          if (!res) return;

          await run();
          clearVisible();
          log.info("휴지통 비우기 완료", { op: "EmptyTrashButton" });
        } catch (e) {
          log.error("휴지통 비우기 처리 실패", { error: e, op: "EmptyTrashButton" });
        }
      };

      return (
        <Button variant="border" size="sm" color="error-300" disabled={disabled} loading={isPending || undefined} onClick={onClick}>
          영구 삭제
        </Button>
      );
    },
    [clearVisible, isTrashEmpty]
  );

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <CheckBox aria-label="select all post" checked={isAllCheck} indeterminate={isIndeterminateOnPage} onChange={onAllCheckChange} />
        <RestoreButton postIds={postIds}>{renderOnRestore}</RestoreButton>
        <EmptyTrashButton>{renderOnEmptyTrash}</EmptyTrashButton>
      </div>
      <div className={toolbar.rightArea}>
        <PageSizeSelector value={pageSize} onChange={setPageSize} />
      </div>
    </div>
  );
});

TrashToolbar.displayName = "TrashToolbar";
