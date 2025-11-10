"use client";

import { Skeleton } from "@workly/ui";
import * as styles from "./postSectionSkeleton.css";

interface PostSectionSkeletonProps {
  itemCount?: number;
}

const titleWidths = ["72%", "84%", "63%", "78%", "90%"];

export function PostSectionSkeleton({ itemCount = 3 }: PostSectionSkeletonProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.content}>
            <Skeleton variant="pulse" radius="sm" style={{ height: 20, width: titleWidths[i % titleWidths.length], margin: 0 }} />
            <div className={styles.meta}>
              <Skeleton variant="pulse" radius="sm" style={{ width: 64, height: 16, margin: 0 }} />
              <Skeleton variant="pulse" radius="sm" style={{ width: 56, height: 16, margin: 0 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
