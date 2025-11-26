import { style } from "@vanilla-extract/css";

export const title = style({
  fontSize: "24px",
  fontWeight: 600,
  textAlign: "center",
  marginBottom: "24px",
  color: "var(--color-gray-900)",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const submitButton = style({
  marginTop: "16px",
  width: "100%",
});

export const successMessage = style({
  padding: "16px",
  backgroundColor: "var(--color-success-50)",
  color: "var(--color-success-700)",
  borderRadius: "8px",
  textAlign: "center",
  marginBottom: "16px",
  fontSize: "14px",
  lineHeight: "20px",
});

export const errorMessage = style({
  padding: "12px",
  backgroundColor: "var(--color-error-50)",
  color: "var(--color-error-700)",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "20px",
});
