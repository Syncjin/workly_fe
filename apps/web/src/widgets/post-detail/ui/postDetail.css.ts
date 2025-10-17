import { globalStyle, style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minWidth: 960,
});

export const boardArea = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottom: "1px solid var(--color-gray-300)",
});

globalStyle(`${boardArea} h2`, {
  fontSize: 12,
  color: "var(--color-gray-500)",
  padding: "12px 0",
  flex: 1,
  cursor: "pointer",
});

export const headerArea = style({
  display: "flex",
  flexDirection: "column",
});

export const content = style({
  display: "block",
  borderTop: "1px solid var(--color-gray-300)",
  padding: 32,
});

export const editorViewer = style({
  maxWidth: 960,
  margin: "0 auto",
  overflow: "auto",
  wordWrap: "break-word",
  wordBreak: "normal",
  whiteSpace: "normal",
  display: "block",
  position: "relative",
  boxSizing: "content-box",
  padding: "0 16px",
});

export const footer = style({
  display: "flex",
  flexDirection: "column",
});

export const actionArea = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: 12,
  paddingTop: 40,
});
