import React, { cloneElement, isValidElement, ReactElement } from "react";
import Icon from "../Icon";
import { avatarBase, avatarDot, avatarDotSize, avatarIcon, avatarIconSize, avatarImage, avatarSize } from "./avatar.css";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showDot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = "md", showDot = false, dotColor = "var(--color-success-500)", icon, className, style, tabIndex }) => {
  const iconSizeMap = {
    xs: { width: 10, height: 10 },
    sm: { width: 12, height: 12 },
    md: { width: 14, height: 14 },
    lg: { width: 16, height: 16 },
    xl: { width: 18, height: 18 },
    "2xl": { width: 20, height: 20 },
  };

  // icon이 ReactElement이고 size prop이 없으면 dot의 최대 크기로 size를 지정
  let renderedIcon = icon;
  if (isValidElement(icon)) {
    const iconElement = icon as ReactElement<{ size?: { width: number; height: number } }>;
    if (iconElement.props.size === undefined) {
      renderedIcon = cloneElement(iconElement, { size: iconSizeMap[size] });
    }
  }

  return (
    <div className={`${avatarBase} ${avatarSize[size]} ${className || ""}`} style={style} tabIndex={tabIndex}>
      {src ? (
        <img src={src} alt={alt} className={avatarImage} />
      ) : (
        <div className={avatarIcon}>
          <Icon name="user-line" size={iconSizeMap[size]} color="brand-600" />
        </div>
      )}
      {showDot && !icon && <div className={`${avatarDot} ${avatarDotSize[size]}`} style={{ background: dotColor }} />}
      {icon && (
        <div
          className={`${avatarDot} ${avatarIconSize[size]}`}
          style={{
            background: "#fff",
            border: "1.5px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderedIcon}
        </div>
      )}
    </div>
  );
};

export default Avatar;
