"use client";

import { DeletePostButton, type DeletePostRenderProps } from "@/features/post/post-delete";
import { PageSizeSelector, usePageSizeManager } from "@/features/post/post-filter";
import { MovePostButton, MovePostRenderProps } from "@/features/post/post-move";
import { log } from "@/lib/logger";
import { openBoardSelect, openConfirm } from "@/shared/ui/modal/openers";
import { usePageSelectionMeta, useSelectedPostIdsOnPage, useSelectionActions } from "@/widgets/post-list";
import { Button, CheckBox } from "@workly/ui";
import React, { useCallback } from "react";
import { toolbar } from "./myPostsList.css";

/**
 * 내 게시글 페이지의 툴바 컴포넌트
 *
 * 선택된 게시글에 대한 일괄 작업 기능을 제공합니다.
 */
export const MyPostsToolbar = React.memo(() => {
  const { pageSize, setPageSize } = usePageSizeManager();
  const { isAllCheck, isIndeterminateOnPage, totalSelected } = usePageSelectionMeta();
  const { selectAllVisible, clearVisible } = useSelectionActions();
  const postIds = useSelectedPostIdsOnPage();

  const onAllCheckChange = useCallback(() => {
    if (isAllCheck) {
      clearVisible();
    } else {
      selectAllVisible();
    }
  }, [isAllCheck, selectAllVisible, clearVisible]);

  const hasSelectedItems = totalSelected > 0;

  const renderOnDelete = useCallback(
    ({ run, isPending }: DeletePostRenderProps) => {
      const disabled = !hasSelectedItems || isPending;

      const onClick = async () => {
        if (disabled) return;

        if (postIds.length === 0) {
          log.warn("삭제할 게시글이 선택되지 않음", { op: "DeleteToolbarButton" });
          return;
        }

        try {
          const res = await openConfirm({
            header: "게시글 삭제",
            title: "게시글을 삭제하시겠습니까?",
            content: "삭제된 게시글은 휴지통으로 이동됩니다.",
          });
          if (!res) return;

          await run();
          clearVisible();
          log.info("게시글 삭제 완료", { postIds, count: postIds.length, op: "DeleteToolbarButton" });
        } catch (e) {
          log.error("휴지통 이동 처리 실패", { error: e, postIds, op: "DeleteToolbarButton" });
        }
      };

      return (
        <Button variant="border" size="sm" color="gray-300" disabled={disabled} loading={isPending || undefined} onClick={onClick}>
          삭제
        </Button>
      );
    },
    [hasSelectedItems, clearVisible, postIds]
  );

  const renderOnMove = useCallback(
    ({ run, isPending }: MovePostRenderProps) => {
      const disabled = !hasSelectedItems || isPending;

      const onClick = async () => {
        if (disabled) return;

        if (postIds.length === 0) {
          log.warn("이동할 게시글이 선택되지 않음", { op: "MoveToolbarButton" });
          return;
        }

        try {
          const res = await openBoardSelect();
          const boardId = res?.board?.id;
          if (!boardId) return;

          await run(boardId);
          clearVisible();
          log.info("게시글 이동 완료", { postIds, count: postIds.length, boardId, op: "MoveToolbarButton" });
        } catch (e) {
          log.error("게시글 이동 처리 실패", { error: e, postIds, op: "MoveToolbarButton" });
        }
      };

      return (
        <Button variant="border" size="sm" color="gray-300" disabled={disabled} loading={isPending || undefined} onClick={onClick}>
          이동
        </Button>
      );
    },
    [hasSelectedItems, clearVisible, postIds]
  );

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <CheckBox aria-label="select all post" checked={isAllCheck} indeterminate={isIndeterminateOnPage} onChange={onAllCheckChange} />
        <DeletePostButton postIds={postIds}>{renderOnDelete}</DeletePostButton>
        <MovePostButton postIds={postIds}>{renderOnMove}</MovePostButton>
      </div>
      <div className={toolbar.rightArea}>
        <PageSizeSelector value={pageSize} onChange={setPageSize} />
      </div>
    </div>
  );
});

MyPostsToolbar.displayName = "MyPostsToolbar";
