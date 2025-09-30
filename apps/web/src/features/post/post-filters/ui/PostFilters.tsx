/**
 * Post filters UI component
 */

"use client";

import { Button, Icon, Select } from "@workly/ui";
import React from "react";
import type { PostFiltersState } from "../model/types";
import { postFiltersStyles } from "./postFilters.css";

export interface PostFiltersProps {
  filters: PostFiltersState;
  boardOptions?: Array<{ value: number; text: string }>;
  categoryOptions?: Array<{ value: number; text: string }>;
  className?: string;
}

export const PostFilters: React.FC<PostFiltersProps> = ({ filters, boardOptions = [], categoryOptions = [], className }) => {
  const { boardId, categoryId, setBoardId, setCategoryId, clearFilters, hasActiveFilters } = filters;

  return (
    <div className={[postFiltersStyles.container, className].filter(Boolean).join(" ")}>
      <div className={postFiltersStyles.filtersRow}>
        {/* Board Filter */}
        <div className={postFiltersStyles.filterGroup}>
          <label className={postFiltersStyles.filterLabel}>게시판</label>
          <Select
            value={boardId?.toString()}
            onChange={(option) => setBoardId(option.value === "undefined" ? undefined : Number(option.value))}
            placeholder="전체 게시판"
            options={[{ value: "undefined", text: "전체 게시판" }, ...boardOptions.map((opt) => ({ value: opt.value.toString(), text: opt.text }))]}
          >
            <Select.Menu />
          </Select>
        </div>

        {/* Category Filter */}
        <div className={postFiltersStyles.filterGroup}>
          <label className={postFiltersStyles.filterLabel}>카테고리</label>
          <Select
            value={categoryId?.toString()}
            onChange={(option) => setCategoryId(option.value === "undefined" ? undefined : Number(option.value))}
            placeholder="전체 카테고리"
            options={[{ value: "undefined", text: "전체 카테고리" }, ...categoryOptions.map((opt) => ({ value: opt.value.toString(), text: opt.text }))]}
          >
            <Select.Menu />
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button variant="border" size="sm" onClick={clearFilters} className={postFiltersStyles.clearButton}>
            <Icon name="close-line" size={{ width: 16, height: 16 }} />
            필터 초기화
          </Button>
        )}
      </div>
    </div>
  );
};
