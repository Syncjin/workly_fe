import { mediaQuery } from "@/shared/styles/breakpoints";
import { style } from "@vanilla-extract/css";

export const resetPasswordContainer = style({
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

export const resetPasswordCard = style({
  width: "100%",
  maxWidth: "400px",
  padding: "24px",
});

export const logoContainer = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: "24px",
});

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

export const passwordRequirements = style({
  padding: "12px",
  backgroundColor: "var(--color-gray-50)",
  borderRadius: "8px",
  fontSize: "13px",
  lineHeight: "18px",
  color: "var(--color-gray-700)",
  marginBottom: 16,
});

export const passwordRequirementsList = style({
  display: "flex",
  gap: "8px",
  margin: "4px 0 0 0",
  paddingLeft: "0",
  listStyle: "none",
});

export const passwordRequirementsItem = style({
  position: "relative",
  paddingLeft: "12px",
  ":before": {
    content: "•",
    position: "absolute",
    left: "0",
  },
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

export const linkContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  marginTop: "24px",
  fontSize: "14px",
  color: "var(--color-gray-700)",
});

export const link = style({
  color: "var(--color-gray-700)",
  textDecoration: "none",
  cursor: "pointer",
  ":hover": {
    color: "var(--color-brand-600)",
  },
});
