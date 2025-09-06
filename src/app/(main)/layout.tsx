import { Header } from "@/shared/ui/Header";
import { BoardSidebar } from "@/widgets/board-sidebar";
import { Suspense } from "react";
import * as style from "./layout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={style.mainLayout}>
      <Header className={style.headerArea} />
      <Suspense fallback={<div className={style.sidebarArea} aria-busy="true" />}>
        <BoardSidebar className={style.sidebarArea} />
      </Suspense>
      <main className={style.mainArea}>{children}</main>
    </div>
  );
}
