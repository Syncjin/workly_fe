"use client";

import React from "react";
import { BadgeColor, badgeRecipe, sizeVariants } from "./badge.css";

type BadgeSize = keyof typeof sizeVariants;

export type { BadgeSize };

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: BadgeSize;
  color?: BadgeColor;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export const Badge: React.FC<BadgeProps> = ({ size = "md", color = "brand-50", icon, iconPosition = "left", children, className, ...rest }) => {
  // 아이콘 있을 때 padding 조정
  const paddingMap = { sm: 6, md: 8, lg: 10 } as const;
  let style = rest.style || {};
  if (icon) {
    if (iconPosition === "left") {
      style = {
        ...style,
        paddingLeft: paddingMap[size as keyof typeof paddingMap],
      };
    } else {
      style = {
        ...style,
        paddingRight: paddingMap[size as keyof typeof paddingMap],
      };
    }
  }
  return (
    <div className={[badgeRecipe({ size, color }), className].filter(Boolean).join(" ")} style={style} {...rest}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </div>
  );
};
