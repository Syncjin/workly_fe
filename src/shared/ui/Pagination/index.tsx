"use client";

import { Pagination as ApiPagination } from "@/shared/api/types";
import Icon from "@/shared/ui/Icon";
import React, { useMemo } from "react";
import * as s from "./pagination.css";

interface PaginationProps<T = unknown> {
  pagination: ApiPagination<T>;
  onPageChange: (page: number) => void;
  siblingCount?: number; // 현재 페이지 양옆 숫자 개수 (기본 1)
  className?: string;
  style?: React.CSSProperties;
}

type PageItem = { type: "page"; value: number; active: boolean } | { type: "ellipsis"; key: string } | { type: "prev" | "next" | "first" | "last"; disabled: boolean };

export default function Pagination<T = unknown>({ pagination, onPageChange, siblingCount = 1, className, style }: PaginationProps<T>) {
  const { page = 0, totalPages = 0, hasPrev = false, hasNext = false, totalItems = 0 } = pagination || {};
  const items: PageItem[] = useMemo(() => {
    if (!pagination) {
      return [];
    }

    if (typeof totalPages !== "number" || totalPages <= 1) {
      return [];
    }

    if (typeof page !== "number" || page < 1 || page > totalPages) {
      console.warn("Pagination: Invalid page number", page);
      return [];
    }

    if (typeof totalItems !== "number" || totalItems < 0) {
      console.warn("Pagination: Invalid totalItems", totalItems);
      return [];
    }

    // Additional validation for boolean properties
    if (typeof hasPrev !== "boolean" || typeof hasNext !== "boolean") {
      console.warn("Pagination: Invalid hasPrev or hasNext values");
      return [];
    }
    const result: PageItem[] = [];
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // 첫 페이지 버튼 (현재 페이지가 1이 아닐 때만 표시)
    if (currentPage > 1) {
      result.push({ type: "first", disabled: false });
    }

    // 이전 페이지 버튼
    result.push({ type: "prev", disabled: !hasPrev });

    const first = 1;
    const last = totalPages; // API에서 제공하는 totalPages 직접 사용
    const left = Math.max(first, currentPage - siblingCount);
    const right = Math.min(last, currentPage + siblingCount);

    // 앞부분
    if (left > first) {
      result.push({ type: "page", value: first, active: currentPage === first });
      if (left > first + 1) result.push({ type: "ellipsis", key: "l" });
    }

    // 중앙
    range(left, right).forEach((n) => result.push({ type: "page", value: n, active: n === currentPage }));

    // 뒷부분
    if (right < last) {
      if (right < last - 1) result.push({ type: "ellipsis", key: "r" });
      result.push({ type: "page", value: last, active: currentPage === last });
    }

    // 다음 페이지 버튼
    result.push({ type: "next", disabled: !hasNext });

    // 마지막 페이지 버튼 (현재 페이지가 마지막이 아닐 때만 표시)
    if (currentPage < totalPages) {
      result.push({ type: "last", disabled: false });
    }

    return result;
  }, [pagination, siblingCount, page, totalPages, hasPrev, hasNext, totalItems]);

  if (!pagination) {
    return null;
  }

  if (!onPageChange) {
    console.warn("Pagination: onPageChange callback is required");
    return null;
  }

  if (typeof totalPages !== "number" || totalPages <= 1) {
    return null;
  }

  if (typeof page !== "number" || page < 1 || page > totalPages) {
    return null;
  }

  if (typeof totalItems !== "number" || totalItems < 0) {
    return null;
  }

  if (typeof hasPrev !== "boolean" || typeof hasNext !== "boolean") {
    return null;
  }

  const handleClick = (it: PageItem) => {
    if (it.type === "page") onPageChange(it.value);
    if (it.type === "prev" && hasPrev) onPageChange(pagination.prevPage);
    if (it.type === "next" && hasNext) onPageChange(pagination.nextPage);
    if (it.type === "first") onPageChange(1);
    if (it.type === "last") onPageChange(totalPages);
  };

  return (
    <nav className={[s.container, className].filter(Boolean).join(" ")} style={style} aria-label="페이지 네비게이션">
      <ul className={s.list} role="list">
        {items.map((it, idx) => {
          if (it.type === "ellipsis")
            return (
              <li key={`${it.key}-${idx}`} className={s.ellipsis} aria-hidden>
                …
              </li>
            );

          if (it.type === "page")
            return (
              <li key={it.value}>
                <button type="button" className={s.item} data-active={it.active ? "true" : "false"} aria-current={it.active ? "page" : undefined} onClick={() => handleClick(it)}>
                  {it.value}
                </button>
              </li>
            );

          const getNavigationButton = (type: string) => {
            switch (type) {
              case "first":
                return {
                  label: "첫 페이지",
                  symbol: <Icon name="arrow-double-left-s-line" size={{ width: 20, height: 20 }} color="var(--color-gray-500)" />,
                };
              case "prev":
                return {
                  label: "이전 페이지",
                  symbol: <Icon name="arrow-left-s-line" size={{ width: 20, height: 20 }} color="var(--color-gray-500)" />,
                };
              case "next":
                return {
                  label: "다음 페이지",
                  symbol: <Icon name="arrow-right-s-line" size={{ width: 20, height: 20 }} color="var(--color-gray-500)" />,
                };
              case "last":
                return {
                  label: "마지막 페이지",
                  symbol: <Icon name="arrow-double-right-s-line" size={{ width: 20, height: 20 }} color="var(--color-gray-500)" />,
                };
              default:
                return { label: "", symbol: null };
            }
          };

          const { label, symbol } = getNavigationButton(it.type);
          const isNavigationButton = ["first", "prev", "next", "last"].includes(it.type);
          return (
            <li key={`${it.type}-${idx}`}>
              <button type="button" className={s.item} data-nav-type={isNavigationButton ? it.type : undefined} disabled={it.disabled} aria-label={label} onClick={() => handleClick(it)}>
                {symbol}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
