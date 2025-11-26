import React from "react";

import * as styles from "./skeleton.css";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 애니메이션 타입 */
  variant?: "shimmer" | "pulse" | "none";
  /** 테두리 굴림 선택 (옵션) */
  radius?: keyof typeof styles.rounded;
  className?: string;
  style?: React.CSSProperties;
};

const Skeleton: React.FC<SkeletonProps> = ({ className, variant = "shimmer", radius, ...rest }) => {
  const anim = variant === "shimmer" ? styles.shimmer : variant === "pulse" ? styles.pulse : undefined;

  return <div className={[styles.container, anim, radius ? styles.rounded[radius] : undefined, className].filter(Boolean).join(" ")} {...rest} />;
};

export default Skeleton;
