"use client";

import Skeleton from "@/shared/ui/Skeleton";
import * as styles from "./postListSkeleton.css";

type PostListSkeletonProps = {
  rows?: number;
  dense?: boolean;
  showBottomMeta?: boolean;
  showLeftCheck?: boolean;
  showRightDate?: boolean;
  variant?: "shimmer" | "pulse" | "none";
  className?: string;
};

const titleWidths = ["72%", "84%", "63%", "78%", "90%", "68%", "80%", "74%"];

export function PostListSkeleton({ rows = 8, dense = false, showBottomMeta = true, showLeftCheck = true, showRightDate = true, variant = "pulse", className }: PostListSkeletonProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")} aria-hidden aria-busy="true" role="status">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className={styles.row} data-dense={dense ? "true" : "false"}>
          {showLeftCheck && <Skeleton variant={variant} radius="sm" className={styles.left} style={{ width: 16, height: 16, margin: 0 }} />}

          <div className={styles.center}>
            {/* 제목 라인 (행마다 길이 약간씩 다르게) */}
            <Skeleton variant={variant} radius="sm" className={styles.title} style={{ height: 20, width: titleWidths[i % titleWidths.length], margin: 0 }} />

            {showBottomMeta && (
              <div className={styles.bottom}>
                <Skeleton variant={variant} radius="full" className={styles.chip} style={{ width: 64, height: 14, margin: 0 }} />
                <span className={styles.dot} aria-hidden>
                  ·
                </span>
                <Skeleton variant={variant} radius="full" className={styles.chip} style={{ width: 56, height: 14, margin: 0 }} />
                <span className={styles.dot} aria-hidden>
                  ·
                </span>
                <Skeleton variant={variant} radius="full" className={styles.chip} style={{ width: 72, height: 14, margin: 0 }} />
              </div>
            )}
          </div>

          {showRightDate && <Skeleton variant={variant} radius="sm" className={styles.right} style={{ width: 84, height: 20, margin: 0 }} />}
        </li>
      ))}
    </ul>
  );
}
