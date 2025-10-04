import { style } from "@vanilla-extract/css";

export const headerText = style({
  display: "block",
  padding: "0 12px 0 32px",
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--color-gray-900)",
  lineHeight: "32px",
  textAlign: "left",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const boardText = style({
  display: "inline-block",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "32px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  paddingLeft: "5px",
});

export const list = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0 9px",
  transition: "background 0.2s ease",
  color: "var(--color-gray-900)",
  selectors: {
    "&:hover": { background: "var(--color-gray-200)", cursor: "pointer" },
    '&[data-active="true"]': {
      color: "#1d4ed8",
      fontWeight: 600,
    },
  },
});

export const popup = style({
  width: "400px",
});

export const content = style({
  padding: "20px",
});

export const loading = style({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  padding: 50,
});
