import React from "react";
import { avatarSize } from "./avatar.css";
import { avatarGroupContainer, avatarGroupItem, avatarGroupOverflow, avatarGroupOverflowBase } from "./avatarGroup.css";
import Avatar from "./index";

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    dotColor?: string;
    icon?: React.ReactNode;
  }>;
  size?: "xs" | "sm" | "md";
  max?: number;
  className?: string;
  style?: React.CSSProperties;
  showDot?: boolean;
}

const marginMap = {
  xs: -4,
  sm: -8,
  md: -12,
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, size = "md", max = 5, className, showDot = false, style }) => {
  const overflowCount = avatars.length - max;
  const displayAvatars = avatars.slice(0, max);

  return (
    <div className={`${avatarGroupContainer} ${className || ""}`} style={style}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={avatarGroupItem}
          style={{
            zIndex: index + 1,
            marginLeft: index > 0 ? `${marginMap[size]}px` : 0,
          }}
        >
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {showDot && overflowCount > 0 && (
        <div
          className={avatarGroupItem}
          style={{
            zIndex: 9999,
            marginLeft: `${marginMap[size]}px`,
          }}
        >
          <div className={`${avatarGroupOverflowBase} ${avatarGroupOverflow[size]} ${avatarSize[size]}`}>
            <span>+{overflowCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
