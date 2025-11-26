"use client";

import { PageSizeSelector, usePageSizeManager } from "@/features/post/post-filter";
import React from "react";
import { toolbar } from "./mustReadList.css";

/**
 * 필독 게시글 페이지의 툴바 컴포넌트
 *
 * 페이징 사이즈 기능을 제공합니다.
 */
export const MustReadToolbar = React.memo(() => {
  const { pageSize, setPageSize } = usePageSizeManager();

  return (
    <div className={toolbar.container}>
      <div className={toolbar.rightArea}>
        <PageSizeSelector value={pageSize} onChange={setPageSize} />
      </div>
    </div>
  );
});

MustReadToolbar.displayName = "MustReadToolbar";
