import { style } from "@vanilla-extract/css";

// CSS 변수 정의
const sidebarWidthExpanded = "240px";
const sidebarWidthCollapsed = "60px";
const transitionDuration = "200ms";

export const mainLayout = style({
  height: "100dvh",
  display: "grid",
  gridTemplateRows: "60px 1fr", // Header height (60px) + remaining space
  gridTemplateColumns: `${sidebarWidthExpanded} 1fr`, // Sidebar width (240px) + remaining space
  gridTemplateAreas: `
    "header header"
    "sidebar content"
  `,
  background: "#fff",
  transition: `grid-template-columns ${transitionDuration} ease-in-out`,

  // prefers-reduced-motion 설정 고려
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const collapsed = style({
  gridTemplateColumns: `${sidebarWidthCollapsed} 1fr`, // 축소된 사이드바 너비 (60px)
});

export const headerArea = style({
  gridArea: "header",
  zIndex: 100,
});

export const sidebarArea = style({
  gridArea: "sidebar",
  overflow: "visible", // tooltip이 보이도록 변경
  backgroundColor: "var(--color-gray-50)",
});

export const contentLayout = style({
  gridArea: "content",
  overflow: "auto", // 내부 콘텐츠 스크롤 허용
  background: "#fff",
  padding: "24px 24px 80px 24px",
  boxSizing: "border-box",
});
