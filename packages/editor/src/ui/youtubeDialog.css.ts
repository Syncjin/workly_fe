import { style } from "@vanilla-extract/css";

export const inputContainer = style({
  marginBottom: "16px",
});

export const input = style({
  width: "100%",
});

export const formatGuide = style({
  marginBottom: "16px",
  fontSize: "14px",
  color: "var(--color-gray-600)",
});

export const formatTitle = style({
  margin: "0 0 8px 0",
  fontWeight: "500",
});

export const formatList = style({
  margin: 0,
  paddingLeft: "16px",
});

export const errorContainer = style({
  marginBottom: "16px",
  padding: "12px",
  backgroundColor: "var(--color-red-50)",
  border: "1px solid var(--color-red-200)",
  borderRadius: "6px",
});

export const errorText = style({
  margin: 0,
  color: "var(--color-red-700)",
  fontSize: "14px",
});

export const footerActions = style({
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
});
