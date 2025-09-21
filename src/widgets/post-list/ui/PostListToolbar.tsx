"use client";

import { PostSearch, usePostSearch } from "@/features/post";
import { useSearchParamsManager } from "@/features/post/post-search";
import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toolbar } from "./postList.css";

export const PostListToolbar = React.memo(() => {
  const [checked, setChecked] = useState(false);
  const searchParams = useSearchParams();

  const search = usePostSearch(searchParams?.get("keyword") || undefined);
  const { updateSearchParams } = useSearchParamsManager();

  const allCheckedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.checke", e.target.checked);
  }, []);

  const onSearch = useCallback(
    async (keyword: string) => {
      await updateSearchParams({ keyword, page: 1 });
    },
    [updateSearchParams]
  );

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <CheckBox aria-label="select all post" checked={!!checked} onChange={allCheckedChange} />
        <Button variant="border" size="md" color="gray-300">
          읽음
        </Button>
        <Button variant="border" size="md" color="gray-300">
          삭제
        </Button>
        <Button variant="border" size="md" color="gray-300">
          이동
        </Button>
        <PostSearch search={search} onSearch={onSearch} />
      </div>
    </div>
  );
});

PostListToolbar.displayName = "PostListToolbar";
