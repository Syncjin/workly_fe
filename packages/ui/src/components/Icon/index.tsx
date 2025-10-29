"use client";
import type { IconName } from "@workly/icons";
import React from "react";
import { useIconCache } from "./useIconCache";

type ColorVariant = string; // TODO: Import from shared styles

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: { width: number; height: number } | number;
  color?: string | ColorVariant;
}

function isColorVariant(color?: string): color is ColorVariant {
  return !!color && /^([a-z\-]+)-(25|50|100|200|300|400|500|600|700|800|900)$/.test(color);
}

const Icon: React.FC<IconProps> = React.memo(({ name, size = 20, color = "currentColor", className, style, ...props }) => {
  const iconSize = React.useMemo(() => {
    return typeof size === "number" ? size : Math.max(size.width, size.height);
  }, [size]);

  const fillColor = React.useMemo(() => {
    return isColorVariant(color) ? `var(--color-${color})` : color;
  }, [color]);

  // useIconCache 훅을 사용하여 캐시 시스템과 연동
  const { component: SvgComponent, isLoading: loading, error } = useIconCache(name);

  // 캐시된 아이콘이 있으면 즉시 렌더링 (반짝임 방지)
  if (SvgComponent) {
    return <SvgComponent width={iconSize} height={iconSize} fill={fillColor} className={className} style={{ display: "inline-block", ...style }} {...props} />;
  }

  // 에러 상태에서의 폴백 UI
  if (error) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={fillColor} className={className} style={{ display: "inline-block", ...style }} {...props}>
        <rect width="24" height="24" fill="none" />
        <text x="12" y="12" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="currentColor">
          ?
        </text>
      </svg>
    );
  }

  if (loading) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className} style={{ display: "inline-block", ...style }} {...props}>
        <rect width="24" height="24" fill="none" />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className} style={{ display: "inline-block", ...style }} {...props}>
      <rect width="24" height="24" fill="none" />
    </svg>
  );
});

Icon.displayName = "Icon";

export default Icon;
