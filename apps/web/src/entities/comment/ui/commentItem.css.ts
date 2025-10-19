import { style } from "@vanilla-extract/css";

export const right = style({
  position: "absolute",
  right: 0,
  top: 0,
});

export const author = style({
  fontSize: 14,
  color: "var(--color-gray-900)",
  fontWeight: 400,
  lineHeight: "17px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block",
});

export const date = style({
  fontSize: 12,
  color: "var(--color-gray-700)",
  lineHeight: "17px",
  display: "inline-block",
});

export const content = style({
  fontSize: 14,
  color: "var(--color-gray-900)",
  lineHeight: "22px",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  position: "relative",
  gap: 8,
  alignContent: "center",
});

export const contentArea = style({
  padding: "8px 16px 0 0",
  wordWrap: "break-word",
  wordBreak: "break-word",
});

export const footer = style({
  marginTop: 12,
});

export const container = style({
  position: "relative",
  padding: "16px 0",
  display: "flex",
  flexDirection: "row",
});

export const main = style({
  margin: "0 0 0 12px",
});
