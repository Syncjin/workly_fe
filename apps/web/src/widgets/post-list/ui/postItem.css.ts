import { style } from "@vanilla-extract/css";

export const postItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  backgroundColor: "var(--color-gray-50)",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.2s",

  ":hover": {
    backgroundColor: "var(--color-gray-100)",
  },

  "@media": {
    "(max-width: 768px)": {
      padding: "10px 12px",
    },
  },
});

export const postInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: 1,
  minWidth: 0,
});

export const postTitle = style({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
  color: "var(--color-gray-900)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "13px",
      lineHeight: "18px",
    },
  },
});

export const postMeta = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  lineHeight: "16px",
  color: "var(--color-gray-600)",
  flexWrap: "wrap",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "11px",
      lineHeight: "14px",
      gap: "6px",
    },
  },
});

export const boardBadge = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  backgroundColor: "var(--color-gray-200)",
  borderRadius: "4px",
  fontSize: "12px",
  lineHeight: "16px",
  color: "var(--color-gray-700)",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "11px",
      lineHeight: "14px",
      padding: "2px 6px",
    },
  },
});
