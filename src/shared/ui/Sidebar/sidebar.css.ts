import { globalStyle, style } from "@vanilla-extract/css";

export const container = style({
  width: 240,
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--color-gray-50)",
});

export const headerArea = style({
  padding: "12px 12px 0px 12px",
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

export const nav = style({
  padding: "4px 8px 16px",
  flex: 1,
});

export const categorySection = style({
  marginBottom: 6,
});

export const categoryHeader = style({
  width: "100%",
  padding: "4px",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  gap: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "var(--color-gray-900)",
  fontSize: 14,
  fontWeight: 600,
  selectors: {
    "&:hover": { background: "var(--color-gray-200)" },
  },
});

export const chevron = style({
  display: "inline-block",
  transition: "transform 0.2s ease",
  selectors: {
    '&[data-open="true"]': { transform: "rotate(90deg)" },
  },
});

export const categoryIcon = style({
  width: 18,
  height: 18,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const categoryName = style({
  lineHeight: "20px",
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--color-gray-900)",
});

export const boardList = style({
  listStyle: "none",
  padding: 0,
  margin: "0px 0 0px 0px",
  maxHeight: 0,
  overflow: "hidden",
  transition: "max-height 0.22s ease",
  selectors: {
    '&[data-open="true"]': { maxHeight: 800 },
  },
});

export const boardItem = style({
  width: "100%",
  borderRadius: 8,
  padding: "5px 16px",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: 4,
  textDecoration: "none",
  background: "transparent",
  fontSize: 14,
  lineHeight: "20px",
  color: "var(--color-gray-600)",
  border: "none",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: "var(--color-gray-200)" },
    '&[data-active="true"]': {
      background: "#eef2ff",
      color: "#1d4ed8",
      fontWeight: 600,
    },
  },
});

export const boardDot = style({
  selectors: {
    [`${boardItem}[data-active="true"] &`]: {
      background: "#1d4ed8",
    },
  },
});

export const boardName = style({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
});

globalStyle(`${boardList} li`, {
  margin: 0,
  padding: 0,
});
