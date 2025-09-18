import { style } from "@vanilla-extract/css";

export const emptyStateContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "200px",
  height: "100%",
  flex: 1,
  padding: "32px 16px",
});

export const emptyStateContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "400px",
});

export const emptyStateIcon = style({
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const emptyStateTitle = style({
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "24px",
  color: "var(--color-gray-600)",
  margin: "0 0 4px 0",
});

export const emptyStateDescription = style({
  fontSize: "16px",
  lineHeight: "24px",
  color: "var(--color-gray-500)",
  margin: "0 0 16px 0",
});
