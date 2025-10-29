"use client";

import { PostSearch, usePostSearch } from "@/features/post";
import { DeletePostButton, type DeletePostRenderProps } from "@/features/post/post-delete";
import { MovePostButton, MovePostRenderProps } from "@/features/post/post-move";
import { usePostReadAction } from "@/features/post/post-read";
import { useSearchParamsManager } from "@/features/post/post-search";
import { log } from "@/lib/logger";
import { openBoardSelect, openConfirm } from "@/shared/ui/modal/openers";
import { usePageSelectionMeta, useSelectedPostIdsOnPage, useSelectionActions } from "@/widgets/post-list/model/SelectionStore";
import { Button, CheckBox } from "@workly/ui";
import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { toolbar } from "./postList.css";

export const PostListToolbar = React.memo(() => {
  const searchParams = useSearchParams();
  const search = usePostSearch(searchParams?.get("keyword") || undefined);
  const { updateSearchParams } = useSearchParamsManager();

  const { isAllCheck, isIndeterminateOnPage, totalSelected } = usePageSelectionMeta();
  const { selectAllVisible, clearVisible } = useSelectionActions();
  const postIds = useSelectedPostIdsOnPage();
  const { run: postSelectRead } = usePostReadAction();

  const onAllCheckChange = useCallback(() => {
    if (isAllCheck) {
      clearVisible();
    } else {
      selectAllVisible();
    }
  }, [isAllCheck, selectAllVisible, clearVisible]);

  const hasSelectedItems = totalSelected > 0;

  const onSearch = useCallback(
    async (keyword: string) => {
      await updateSearchParams({ keyword, page: 1 });
    },
    [updateSearchParams]
  );

  const handleOnRead = useCallback(async () => {
    if (postIds.length === 0) return;
    try {
      await postSelectRead(postIds);
      clearVisible();
    } catch (e) {
      log.error("읾음 처리 실패", { error: e, op: "handleOnRead" });
    }
  }, [clearVisible, postIds, postSelectRead]);

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
          const res = await openConfirm({ header: "게시글 삭제", title: "게시글을 삭제하시겠습니까?" });
          if (!res) return;
          await run();
          clearVisible();
          log.info("게시글 삭제 완료", { postIds, count: postIds.length, op: "DeleteToolbarButton" });
        } catch (e) {
          log.error("휴지통 이동 처리 실패", { error: e, postIds, op: "DeleteToolbarButton" });
        }
      };

      return (
        <Button variant="border" size="md" color="gray-300" disabled={disabled} loading={isPending || undefined} onClick={onClick}>
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
        } catch (e) {
          log.error("게시글 이동 처리 실패", { error: e, postIds, op: "MoveToolbarButton" });
        }
      };

      return (
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems} onClick={onClick}>
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
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems} onClick={handleOnRead}>
          읽음
        </Button>
        <DeletePostButton postIds={postIds}>{renderOnDelete}</DeletePostButton>
        <MovePostButton postIds={postIds}>{renderOnMove}</MovePostButton>
        <PostSearch search={search} onSearch={onSearch} />
      </div>
    </div>
  );
});

PostListToolbar.displayName = "PostListToolbar";
