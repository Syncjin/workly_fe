"use client";

import { useSidebar } from "@/lib/providers/SidebarProvider";
import { AppHeader } from "@/widgets/app-header";
import { BoardSidebar } from "@/widgets/board-sidebar";
import { SidebarBoundary } from "@/widgets/board-sidebar/ui/BoardSidebarBoundary";
import * as style from "./layout.css";

interface MainLayoutContentProps {
  children: React.ReactNode;
}

export function MainLayoutContent({ children }: MainLayoutContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <main className={`${style.mainLayout} ${isCollapsed ? style.collapsed : ""}`}>
      <AppHeader className={style.headerArea} />
      <SidebarBoundary>
        <BoardSidebar className={style.sidebarArea} />
      </SidebarBoundary>
      <div className={style.contentLayout}>{children}</div>
    </main>
  );
}
