import { mediaQuery } from "@/shared/styles/breakpoints";
import { style } from "@vanilla-extract/css";

export const accountRecoveryContainer = style({
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

export const accountRecoveryCard = style({
  width: "100%",
  maxWidth: "400px",
  padding: "24px",
});

export const logoContainer = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: "24px",
});

export const tabContainer = style({
  display: "flex",
  gap: "8px",
  marginBottom: "24px",
  borderBottom: "2px solid var(--color-gray-200)",
});

export const tab = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: "16px",
  fontWeight: 500,
  color: "var(--color-gray-600)",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "2px solid transparent",
  marginBottom: "-2px",
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    color: "var(--color-gray-900)",
  },
});

export const tabActive = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--color-brand-600)",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "2px solid var(--color-brand-600)",
  marginBottom: "-2px",
  cursor: "pointer",
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
