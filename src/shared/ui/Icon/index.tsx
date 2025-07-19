"use client";
import { IconName } from "@/assets/images/icons/icon-types";
import dynamic from "next/dynamic";
import React from "react";
import type { ColorVariant } from "@/shared/styles/colorTypes";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string | ColorVariant;
  className?: string;
};

function isColorVariant(color?: string): color is ColorVariant {
  return !!color && /^([a-z\-]+)-(25|50|100|200|300|400|500|600|700|800|900)$/.test(color);
}

const Icon = ({ name, size = 20, color = "currentColor", className }: IconProps) => {
  const ImportedIcon = dynamic(() => import(`@/assets/images/icons/${name}.svg`), {
    ssr: false,
  });

  // color가 ColorVariant면 CSS 변수로 변환
  const fillColor = isColorVariant(color) ? `var(--color-${color})` : color;

  return (
    <span style={{ display: "inline-flex", width: size, height: size, color: fillColor }} className={className}>
      <ImportedIcon width={size} height={size} fill={fillColor} />
    </span>
  );
};

export default Icon;
