import { style } from "@vanilla-extract/css";

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

