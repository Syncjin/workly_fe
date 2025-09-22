"use client";

import { PostSearch, usePostSearch } from "@/features/post";
import { useSearchParamsManager } from "@/features/post/post-search";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import { usePageSelectionMeta, useSelectionActions } from "@/widgets/post-list/model/SelectionStore";
import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { toolbar } from "./postList.css";

export const PostListToolbar = React.memo(() => {
  const searchParams = useSearchParams();
  const search = usePostSearch(searchParams?.get("keyword") || undefined);
  const { updateSearchParams } = useSearchParamsManager();

  const { isAllCheck, isIndeterminateOnPage, totalSelected } = usePageSelectionMeta();

  const { selectAllVisible, clearVisible } = useSelectionActions();

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

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <CheckBox aria-label="select all post" checked={isAllCheck} indeterminate={isIndeterminateOnPage} onChange={onAllCheckChange} />
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems}>
          읽음
        </Button>
        <Button variant="border" size="md" color="gray-300" disabled={!hasSelectedItems}>
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
