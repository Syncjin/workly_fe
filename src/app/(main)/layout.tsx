import { Header } from "@/shared/ui/Header";
import { BoardSidebar } from "@/widgets/board-sidebar";
import { SidebarBoundary } from "@/widgets/board-sidebar/ui/BoardSidebarBoundary";
import * as style from "./layout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={style.mainLayout}>
      <Header />
      <SidebarBoundary>
        <BoardSidebar />
      </SidebarBoundary>

      <main>{children}</main>
    </div>
  );
}
