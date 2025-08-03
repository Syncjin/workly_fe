"use client";
import { IconName } from "@/assets/images/icons/icon-types";
import type { ColorVariant } from "@/shared/styles/colorTypes";
import dynamic from "next/dynamic";
import React from "react";

type IconProps = {
  name: IconName;
  size?: { width: number; height: number };
  color?: string | ColorVariant;
  className?: string;
};

function isColorVariant(color?: string): color is ColorVariant {
  return !!color && /^([a-z\-]+)-(25|50|100|200|300|400|500|600|700|800|900)$/.test(color);
}

// dynamic import 캐싱용 객체 생성
const iconCache: Record<string, ReturnType<typeof dynamic>> = {};

function getDynamicIcon(name: string) {
  if (!iconCache[name]) {
    iconCache[name] = dynamic(() => import(`@/assets/images/icons/${name}.svg`), { ssr: false });
  }
  return iconCache[name];
}

const Icon = ({ name, size = { width: 20, height: 20 }, color = "currentColor", className }: IconProps) => {
  const ImportedIcon = getDynamicIcon(name);

  // color가 ColorVariant면 CSS 변수로 변환
  const fillColor = isColorVariant(color) ? `var(--color-${color})` : color;

  return (
    <span
      style={{
        display: "inline-flex",
        width: size.width,
        height: size.height,
        color: fillColor,
      }}
      className={className}
    >
      {ImportedIcon &&
        React.createElement(ImportedIcon as any, {
          width: size.width,
          height: size.height,
          fill: fillColor,
        })}
    </span>
  );
};

export default Icon;
