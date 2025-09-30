/**
 * Post search UI component
 */

"use client";

import { Button, Icon, Input } from "@workly/ui";
import React from "react";
import type { PostSearchState } from "../model/types";
import { postSearchStyles } from "./postSearch.css";

export interface PostSearchProps {
  search: PostSearchState;
  placeholder?: string;
  className?: string;
  onSearch?: (keyword: string) => void;
}

export const PostSearch: React.FC<PostSearchProps> = ({ search, placeholder = "게시글 검색", className, onSearch }) => {
  const { keyword, setKeyword, clearSearch, hasActiveSearch } = search;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit", keyword);
    onSearch?.(keyword.trim());
  };

  const handleClear = () => {
    clearSearch();
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSubmit} className={[postSearchStyles.container, className].filter(Boolean).join(" ")}>
      <div className={postSearchStyles.inputWrapper}>
        <Input
          type="text"
          size="sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className={postSearchStyles.searchInput}
          rightOffset={0}
          right={
            <>
              {hasActiveSearch && (
                <Button type="button" variant="ghost" size="sm" onClick={handleClear} aria-label="검색어 지우기" className={postSearchStyles.clearButton}>
                  <Icon name="close-line" size={{ width: 16, height: 16 }} />
                </Button>
              )}
            </>
          }
          left={<Icon name="search-line" size={{ width: 18, height: 18 }} color="var(--color-gray-500)" />}
        />
      </div>
    </form>
  );
};
