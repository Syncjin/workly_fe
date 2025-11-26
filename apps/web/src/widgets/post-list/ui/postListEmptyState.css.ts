import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  width: "100%",
  padding: "40px 20px",
});

export const content = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "400px",
});

export const icon = style({
  fontSize: "48px",
  marginBottom: "16px",
});

export const title = style({
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "30px",
  color: "#000",
  margin: "0 0 8px 0",
});

export const description = style({
  fontSize: "14px",
  lineHeight: "20px",
  color: "var(--color-gray-600)",
  margin: "0 0 24px 0",
});

export const button = style({
  minWidth: "140px",
});
