import { style } from "@vanilla-extract/css";

export const right = style({
  position: "absolute",
  right: 0,
  top: 16,
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
  flex: 1,
});

export const footer = style({
  marginTop: 12,
});

export const container = style({
  position: "relative",
  padding: "16px 0",
  display: "flex",
  flexDirection: "row",
  selectors: {
    "&:first-child": {
      borderTop: "1px solid var(--color-gray-100)",
    },

    "&:not(:first-child)::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 50,
      right: 0,
      height: 1,
      background: "var(--color-gray-100)",
    },
  },
});

export const main = style({
  margin: "0 0 0 12px",
  width: "100%",
});

export const reactionBtn = style({
  display: "flex",
  alignItems: "center",
  gap: 4,
  border: "1px solid var(--color-gray-200)",
  backgroundColor: "var(--color-gray-50)",
  borderRadius: 12,
  padding: "4px 8px",
  fontSize: 12,
  cursor: "pointer",
  transition: "all 0.2s ease",
  selectors: {
    "&:hover": {
      backgroundColor: "var(--color-gray-100)",
      borderColor: "var(--color-gray-300)",
    },
  },
});

export const reactionBtnActive = style({
  backgroundColor: "var(--color-brand-50)",
  borderColor: "var(--color-brand-200)",
  color: "var(--color-brand-600)",
  selectors: {
    "&:hover": {
      backgroundColor: "var(--color-brand-100)",
      borderColor: "var(--color-brand-300)",
    },
  },
});

export const reactionEmoji = style({
  fontSize: 14,
  lineHeight: 1,
});

export const reactionCount = style({
  fontSize: 12,
  fontWeight: 500,
  color: "var(--color-gray-700)",
});

export const reactionList = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
});

export const reactionButtonWrapper = style({
  position: "relative",
  display: "inline-block",
});
