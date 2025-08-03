import { style } from "@vanilla-extract/css";

export const loginContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
});

export const loginCard = style({
  width: "100%",
  maxWidth: "400px",
});

export const logoContainer = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: "32px",
});

export const logoIcon = style({
  width: "64px",
  height: "64px",
  color: "var(--color-brand-600)",
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
});

export const forgotPasswordLink = style({
  fontSize: "14px",
  lineHeight: "20px",
  color: "var(--color-gray-700)",
  textDecoration: "none",
  cursor: "pointer",
});

export const loginButton = style({
  marginTop: "16px",
  width: "100%",
});

export const divider = style({
  display: "flex",
  alignItems: "center",
  margin: "24px 0",
  color: "var(--color-gray-400)",
  fontSize: "14px",
});

export const dividerLine = style({
  flex: 1,
  height: "1px",
  backgroundColor: "var(--color-gray-200)",
});

export const dividerText = style({
  padding: "0 16px",
  color: "var(--color-gray-500)",
});
