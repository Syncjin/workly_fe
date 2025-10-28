"use client";

import { useMyInfo } from "@/entities/users";
import { useSidebar } from "@/lib/providers/SidebarProvider";
import { Avatar, Header, Icon } from "@workly/ui";
import * as styles from "./header.css";

export const AppHeader = ({ className }: { className: string }) => {
  const { data } = useMyInfo({ select: (resp) => resp.data });
  const { isCollapsed, toggle } = useSidebar();

  // 현재 상태에 따른 아이콘 결정
  const menuIcon = isCollapsed ? "menu-unfold-line" : "menu-fold-line";

  return (
    <Header className={className}>
      <Header.Left className={styles.left}>
        <Header.MenuButton onClick={toggle} aria-expanded={!isCollapsed} aria-controls="board-sidebar" aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}>
          <Icon name={menuIcon} size={{ width: 20, height: 20 }} color={"#fff"} />
        </Header.MenuButton>
        <Icon name="logo-horizontal" size={{ width: 72, height: 16 }} color={"#fff"} />
      </Header.Left>
      <Header.Right>{data?.profile ? <Avatar src={data.profile} size="md" /> : <Avatar size="md" />}</Header.Right>
    </Header>
  );
};

export default AppHeader;
