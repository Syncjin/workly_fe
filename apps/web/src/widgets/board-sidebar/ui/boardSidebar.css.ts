import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--color-gray-50)",
});

export const headerArea = style({
  padding: "12px 12px 0px 12px",
});

export const allBoardArea = style({
  padding: "0px 12px 0px 12px",
});

export const allBoardBtn = style({
  fontWeight: 600,
  color: "var(--color-gray-900)",
  fontSize: 12,
  width: "100%",
});

export const createBtn = style({
  width: "100%",
});

export const createBtnIcon = style({
  fontWeight: 700,
  marginRight: 2,
});

export const divider = style({
  height: 1,
  background: "var(--color-gray-300)",
  margin: "16px 12px",
});

export const boardManageText = style({
  fontWeight: 400,
  color: "var(--color-gray-900)",
  fontSize: 14,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "opacity 200ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const boardManageBtn = style({
  fontWeight: 400,
  color: "var(--color-gray-900)",
  fontSize: 12,
  width: 45,
  height: 24,
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  background: "#fff",
  border: "1px solid var(--color-gray-200)",
  borderRadius: 4,
  textDecoration: "none",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: "var(--color-gray-200)" },
  },
});

export const boardManageRow = style({
  display: "flex",
  alignItems: "center",
  margin: "0px 12px 0px 8px",
  borderRadius: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  userSelect: "none",
  overflow: "hidden",
  minHeight: "32px", // 최소 높이 보장
});

// 축소 상태 스타일
export const collapsedBoardArea = style({
  padding: "0px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  opacity: 1,
  transition: "opacity 200ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const collapsedBoardIcon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "var(--color-gray-700)",
  selectors: {
    "&:hover": {
      background: "var(--color-gray-200)",
      color: "var(--color-gray-900)",
    },
  },
});

// 확장 상태 콘텐츠 페이드 효과
export const expandedContent = style({
  opacity: 1,
  transition: "opacity 200ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

// 글쓰기 버튼 전환 효과
export const createBtnContainer = style({
  transition: "all 200ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

// 축소된 게시판 목록 스타일
export const collapsedBoardList = style({
  width: "100%",
  marginTop: "8px",
  display: "flex",
  justifyContent: "center",
});

export const hiddenText = style({
  opacity: 0,
  width: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  transition: "opacity 150ms ease-in-out, width 150ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
      display: "none",
    },
  },
});

export const visibleText = style({
  opacity: 1,
  width: "auto",
  overflow: "visible",
  whiteSpace: "nowrap",
  transition: "opacity 150ms ease-in-out, width 150ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const collapsedCreateBtn = style({
  selectors: {
    "&&": {
      width: "36px",
      minWidth: "36px",
    },
  },
});

export const navContainer = style({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

export const collapsedTrashBin = style({
  padding: "0 12px",
  display: "flex",
  justifyContent: "center",
  marginTop: "8px",
});

export const trashBinContainer = style({
  padding: "4px 8px",
});
