import React, { isValidElement, cloneElement, ReactElement } from "react";
import Icon from "../Icon";
import { avatarBase, avatarSize, avatarImage, avatarIcon, avatarDot, avatarDotSize, avatarIconSize } from "./avatar.css";

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

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  showDot = false,
  dotColor = "var(--color-success-500)",
  icon,
  className,
  style,
  tabIndex,
}) => {
  const iconSizeMap = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
  };
  // dot의 최대 크기
  const dotSizeMap = {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 14,
    "2xl": 16,
  };

  // icon이 ReactElement이고 size prop이 없으면 dot의 최대 크기로 size를 지정
  let renderedIcon = icon;
  if (isValidElement(icon)) {
    const iconElement = icon as ReactElement<{ size?: number }>;
    if (iconElement.props.size === undefined) {
      renderedIcon = cloneElement(iconElement, { size: iconSizeMap[size] });
    }
  }

  return (
    <div 
      className={`${avatarBase} ${avatarSize[size]} ${className || ""}`} 
      style={style}
      tabIndex={tabIndex}
    >
      {src ? (
        <img src={src} alt={alt} className={avatarImage} />
      ) : (
        <div className={avatarIcon}>
          <Icon name="user-line" size={iconSizeMap[size]} />
        </div>
      )}
      {showDot && !icon && (
        <div 
          className={`${avatarDot} ${avatarDotSize[size]}`}
          style={{ background: dotColor }}
        />
      )}
      {icon && (
        <div 
          className={`${avatarDot} ${avatarIconSize[size]}`}
          style={{ 
            background: "#fff", 
            border: "1.5px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {renderedIcon}
        </div>
      )}
    </div>
  );
};

export default Avatar; 