import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const item = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  backgroundColor: "var(--color-gray-50)",
  borderRadius: "8px",

  "@media": {
    "(max-width: 768px)": {
      padding: "10px 12px",
    },
  },
});

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: 1,
  minWidth: 0,
});

export const title = style({
  // height와 width는 inline style로 지정
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",

  "@media": {
    "(max-width: 768px)": {
      gap: "6px",
    },
  },
});

export const badge = style({
  // width와 height는 inline style로 지정
});

export const date = style({
  // width와 height는 inline style로 지정
});
