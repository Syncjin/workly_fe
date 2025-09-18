// src/widgets/header/Header.tsx
"use client";

import Icon from "@/shared/ui/Icon";
import Avatar from "../Avatar";
import * as styles from "./Header.css";

interface HeaderProps {
  onLogoClick?: () => void;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onAvatarClick?: () => void;
  avatarUrl?: string;
  className?: string;
}

export const Header = ({ onLogoClick, onMenuClick, onSettingsClick, onNotificationsClick, onAvatarClick, avatarUrl, className }: HeaderProps) => {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.leftSection}>
        <div className={styles.iconButton} onClick={onMenuClick}>
          <Icon name="menu-line" size={{ width: 20, height: 20 }} color={"#fff"} />
        </div>
        <div className={styles.logo} onClick={onLogoClick}>
          <Icon name="logo-horizontal" size={{ width: 72, height: 16 }} color={"#fff"} />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.iconButton} onClick={onNotificationsClick}>
          <Icon name="checkbox-line" size={{ width: 20, height: 20 }} color={"#fff"} />
        </div>
        <div className={styles.iconButton} onClick={onSettingsClick}>
          <Icon name="settings-2-line" size={{ width: 20, height: 20 }} color={"#fff"} />
        </div>
        <div onClick={onAvatarClick}>{avatarUrl ? <Avatar src={avatarUrl} alt="avatar" size="md" /> : <Avatar showDot size="md" />}</div>
      </div>
    </header>
  );
};
