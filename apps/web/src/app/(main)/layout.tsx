import AppProvider from "@/lib/providers/AppProvider";
import { BoardSidebar } from "@/widgets/board-sidebar";
import { SidebarBoundary } from "@/widgets/board-sidebar/ui/BoardSidebarBoundary";
import { Header } from "@workly/ui";
import * as style from "./layout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <main className={style.mainLayout}>
        <Header className={style.headerArea} />
        <SidebarBoundary>
          <BoardSidebar className={style.sidebarArea} />
        </SidebarBoundary>
        <div className={style.contentLayout}>{children}</div>
      </main>
    </AppProvider>
  );
}
