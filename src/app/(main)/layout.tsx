import { Header } from "@/shared/ui/Header";
import Sidebar, { BoardCategory } from "@/shared/ui/Sidebar";
import * as style from "./layout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const categories: BoardCategory[] = [
    {
      id: "notice",
      name: "공지",
      boards: [
        { id: "company-news", name: "회사 소식", href: "/board/company-news" },
        { id: "policy", name: "정책/가이드", href: "/board/policy" },
      ],
    },
    {
      id: "community",
      name: "커뮤니티",
      boards: [
        { id: "free", name: "자유게시판", href: "/board/free" },
        { id: "qna", name: "Q&A", href: "/board/qna" },
      ],
    },
  ];

  return (
    <div className={style.mainLayout}>
      <Header />
      <Sidebar categories={categories}></Sidebar>
      {children}
    </div>
  );
}
