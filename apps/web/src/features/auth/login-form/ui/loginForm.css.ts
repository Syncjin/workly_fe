import { mediaQuery } from "@/shared/styles/breakpoints";
import { style } from "@vanilla-extract/css";

export const loginContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  "@media": {
    [mediaQuery.md]: {
      padding: "0 32px",
    },
  },
});

export const loginCard = style({
  width: "100%",
  maxWidth: "400px",
  padding: "24px",
});

export const logoContainer = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: "24px",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const checkboxContainer = style({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "16px",
  flexWrap: "wrap",
  gap: "12px",
});

export const forgotPasswordLink = style({
  fontSize: "14px",
  lineHeight: "20px",
  color: "var(--color-gray-700)",
  textDecoration: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
});

export const loginButton = style({
  marginTop: "16px",
  width: "100%",
});

export const errorMessage = style({
  padding: "12px",
  backgroundColor: "var(--color-error-50)",
  color: "var(--color-error-700)",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "20px",
});
