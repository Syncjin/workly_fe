import { style } from "@vanilla-extract/css";

export const loginContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "20px",
  backgroundColor: "var(--color-gray-50)",
});

export const loginCard = style({
  width: "100%",
  maxWidth: "400px",
  padding: "40px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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

export const title = style({
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center",
  marginBottom: "32px",
  color: "var(--color-gray-900)",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const label = style({
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--color-gray-700)",
});

export const checkboxContainer = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "8px",
});

export const checkboxLabel = style({
  fontSize: "14px",
  color: "var(--color-gray-600)",
  cursor: "pointer",
});

export const forgotPasswordContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
});

export const forgotPasswordLink = style({
  fontSize: "14px",
  color: "var(--color-brand-600)",
  textDecoration: "none",
  cursor: "pointer",
  ":hover": {
    textDecoration: "underline",
  },
});

export const loginButton = style({
  marginTop: "24px",
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
