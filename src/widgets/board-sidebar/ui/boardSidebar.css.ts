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
  margin: "0px 12px 0px 12px",
  borderRadius: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  userSelect: "none",
});
