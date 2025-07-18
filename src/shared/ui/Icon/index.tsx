"use client";
import { IconName } from "@/assets/images/icons/icon-types";
import dynamic from "next/dynamic";
import React from "react";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
};

const Icon = ({ name, size = 20, color = "currentColor", className }: IconProps) => {
  const ImportedIcon = dynamic(() => import(`@/assets/images/icons/${name}.svg`), {
    ssr: false,
  });

  return (
    <span style={{ display: "inline-flex", width: size, height: size, color }} className={className}>
      <ImportedIcon width={size} height={size} fill="currentColor" />
    </span>
  );
};

export default Icon;
