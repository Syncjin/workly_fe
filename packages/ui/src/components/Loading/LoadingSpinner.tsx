"use client";

import React from "react";
import * as s from "./loadingSpinner.css";

type SpinnerSize = "sm" | "md" | "lg" | number;
type SpinnerThickness = "thin" | "normal" | "thick" | number;

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  thickness?: SpinnerThickness;
  color?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  thickness = "normal",
  color = "var(--color-brand-600)",
  label = "로딩 중…",
  className,
  style,
  ...rest
}) => {
  // 크기/두께가 숫자면 inline 스타일, 프리셋이면 클래스 사용
  const sizeClass =
    typeof size === "number" ? undefined : s.size[size] ?? s.size.md;
  const thicknessClass =
    typeof thickness === "number"
      ? undefined
      : s.thickness[thickness] ?? s.thickness.normal;

  const inlineStyle: React.CSSProperties = {
    ...(typeof size === "number" ? { width: size, height: size } : null),
    ...(typeof thickness === "number" ? { ["--spinner-bw" as any]: `${thickness}px` } : null),
    color, // arc 색상은 currentColor로 처리
    ...style,
  };

  return (
    <div className={s.wrapper} role="status" aria-live="polite" {...rest}>
      <span
        className={[s.spinner, sizeClass, thicknessClass, className]
          .filter(Boolean)
          .join(" ")}
        style={inlineStyle}
        aria-hidden="true"
      />
      <span className={s.srOnly}>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
