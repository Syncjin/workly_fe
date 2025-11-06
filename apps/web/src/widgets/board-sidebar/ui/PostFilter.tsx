"use client";

import { Icon, Tooltip } from "@workly/ui";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import * as styles from "./postFilter.css";

export type PostFilterType = "must-read" | "bookmarks" | "my-posts" | null;

// 유효한 필터 값들을 상수로 정의하여 타입 안전성 확보
export const VALID_FILTER_VALUES = ["must-read", "bookmarks", "my-posts"] as const;
export type ValidFilterValue = (typeof VALID_FILTER_VALUES)[number];

// 필터 값 검증 함수
export const isValidFilterValue = (value: string | null): value is ValidFilterValue => {
  return value !== null && VALID_FILTER_VALUES.includes(value as ValidFilterValue);
};

interface PostFilterProps {
  isCollapsed?: boolean;
}

interface FilterOption {
  key: ValidFilterValue;
  label: string;
  icon?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "must-read", label: "필독", icon: "checkbox-line" },
  { key: "bookmarks", label: "중요", icon: "star-line" },
  { key: "my-posts", label: "내 게시글", icon: "user-line" },
];

export const PostFilter: React.FC<PostFilterProps> = ({ isCollapsed = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = React.useMemo(() => {
    return pathname?.slice(1, pathname.length);
  }, [pathname]);

  const handleFilterClick = React.useCallback(
    (filterKey: PostFilterType) => {
      console.log("handleFilterClick filterKey", filterKey);
      try {
        router.push(`/${filterKey}`);
      } catch (error) {
        console.error("필터 변경 중 오류가 발생했습니다:", error);
      }
    },
    [currentFilter, router, pathname]
  );

  if (isCollapsed) {
    return (
      <div className={styles.collapsedContainer}>
        {FILTER_OPTIONS.map((option) => (
          <Tooltip key={option.key} content={option.label} position="right">
            <button type="button" className={styles.collapsedFilterButton} data-selected={currentFilter === option.key} onClick={() => handleFilterClick(option.key)} aria-label={option.label}>
              <div className={styles.collapsedIconContainer}>
                <Icon name={option.icon as any} size={{ width: 16, height: 16 }} />
              </div>
            </button>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterGrid}>
        {FILTER_OPTIONS.map((option) => (
          <button key={option.key} type="button" className={styles.filterButton} data-selected={currentFilter === option.key} onClick={() => handleFilterClick(option.key)}>
            <div className={styles.filterContent}>
              <div className={styles.iconContainer}>
                <Icon name={option.icon as any} size={{ width: 14, height: 14 }} />
              </div>
              <span className={styles.filterLabel}>{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
