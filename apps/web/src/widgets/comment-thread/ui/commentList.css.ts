import { style } from "@vanilla-extract/css";

export const container = style({
  padding: "60px 0 0 0",
});

export const loadMore = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
});

export const iconButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  cursor: "pointer",
  width: "20px",
  height: "20px",
  transition: "background 0.2s",
  selectors: {
    "&:hover": {
      background: "var(--color-gray-200)",
    },
  },
});

export const menu = style({
  minWidth: 60,
});

export const menuItem = style({
  fontSize: 12,
});

export const replyForm = style({
  paddingLeft: "48px",
  marginTop: "12px",
});

export const replyItem = style({
  paddingLeft: "48px",
});
