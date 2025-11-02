import { style } from "@vanilla-extract/css";

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const row = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 18,
  padding: "12px 10px", // PostListItem와 동일 패딩
  selectors: {
    '&[data-dense="true"]': { padding: "8px 10px" },
  },
});

export const left = style({
  flex: "0 0 16px",
  marginTop: 2,
});

export const center = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

export const title = style({
  // height는 inline style로 지정
});

export const bottom = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginTop: 6,
});

export const chip = style({});

export const dot = style({
  color: "var(--color-gray-400, rgba(0,0,0,.35))",
  fontSize: 12,
  lineHeight: "14px",
  userSelect: "none",
});

export const right = style({
  alignSelf: "center",
  flex: "0 0 84px",
});
