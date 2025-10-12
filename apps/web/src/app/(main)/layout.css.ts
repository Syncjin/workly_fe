import { style } from "@vanilla-extract/css";

export const mainLayout = style({
  height: "100dvh",
  display: "grid",
  gridTemplateRows: "60px 1fr", // Header height (60px) + remaining space
  gridTemplateColumns: "240px 1fr", // Sidebar width (240px) + remaining space
  gridTemplateAreas: `
    "header header"
    "sidebar content"
  `,
  background: "#fff",
});

export const headerArea = style({
  gridArea: "header",
  zIndex: 100,
});

export const sidebarArea = style({
  gridArea: "sidebar",
  overflow: "hidden",
  backgroundColor: "var(--color-gray-50)",
});

export const contentLayout = style({
  gridArea: "content",
  overflow: "auto", // 내부 콘텐츠 스크롤 허용
  background: "#fff",
  padding: "24px 24px 80px 24px",
  boxSizing: "border-box",
});
