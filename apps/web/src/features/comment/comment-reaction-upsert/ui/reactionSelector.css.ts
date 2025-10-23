import { style } from "@vanilla-extract/css";

export const reactionSelector = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
});

export const reactionOption = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  padding: "6px 8px",
  borderRadius: 8,
  border: "1px solid transparent",
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  minWidth: 32,
  minHeight: 32,

  selectors: {
    "&:hover": {
      backgroundColor: "var(--color-gray-50)",
      transform: "scale(1.1)",
    },

    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 2px var(--color-blue-100)",
    },

    "&:active": {
      transform: "scale(0.95)",
    },

    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
      transform: "none",
    },

    "&:disabled:hover": {
      backgroundColor: "transparent",
      transform: "none",
    },
  },
});

export const reactionOptionSelected = style({
  backgroundColor: "var(--color-blue-50)",
  border: "1px solid var(--color-blue-200)",

  selectors: {
    "&:hover": {
      backgroundColor: "var(--color-blue-100)",
    },
  },
});

export const reactionEmoji = style({
  fontSize: 18,
  lineHeight: 1,
  userSelect: "none",
});

export const reactionCount = style({
  fontSize: 12,
  fontWeight: 500,
  color: "var(--color-gray-700)",
  lineHeight: 1,
  minWidth: 12,
  textAlign: "center",
});
