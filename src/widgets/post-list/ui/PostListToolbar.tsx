"use client";

import { PostSearch, usePostSearch } from "@/features/post";
import { usePostDeleteAction } from "@/features/post/post-delete";
import { usePostReadAction } from "@/features/post/post-read";
import { useSearchParamsManager } from "@/features/post/post-search";
import { log } from "@/lib/logger";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import { usePageSelectionMeta, useSelectedPostIdsOnPage, useSelectionActions } from "@/widgets/post-list/model/SelectionStore";
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
  const { run: postSelectDelete } = usePostDeleteAction();

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
      await postSelectRead(postIds); // 낙관적 업데이트 + 서버 반영 + 무효화
      clearVisible(); // UI 정책: 읽음 후 현재 페이지 선택 해제
    } catch (e) {
      log.error("읾음 처리 실패", { error: e, op: "handleOnRead" });
    }
  }, [clearVisible, postIds, postSelectRead]);

  const handleOnDelete = useCallback(async () => {
    if (postIds.length === 0) return;
    try {
      await postSelectDelete(postIds);
      clearVisible();
    } catch (e) {
      log.error("휴지통 이동 처리 실패", { error: e, op: "handleOnDelete" });
    }
  }, [clearVisible, postIds, postSelectDelete]);

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <CheckBox aria-label="select all post" checked={isAllCheck} indeterminate={isIndeterminateOnPage} onChange={onAllCheckChange} />
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems} onClick={handleOnRead}>
          읽음
        </Button>
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems} onClick={handleOnDelete}>
          삭제
        </Button>
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems}>
          이동
        </Button>
        <PostSearch search={search} onSearch={onSearch} />
      </div>
    </div>
  );
});

PostListToolbar.displayName = "PostListToolbar";
