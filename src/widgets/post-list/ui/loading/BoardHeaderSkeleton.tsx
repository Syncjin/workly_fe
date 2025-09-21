"use client";

import Skeleton from "@/shared/ui/Skeleton";
import * as styles from "../postList.css";
export const BoardHeaderSkeleton = () => {
  return <Skeleton variant={"shimmer"} radius="md" className={styles.header} style={{ width: 64, height: 30, margin: 0 }} />;
};
