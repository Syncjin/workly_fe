import { style } from "@vanilla-extract/css";

export const section = style({
  marginTop: "24px",
  "@media": {
    "(max-width: 768px)": {
      marginTop: "16px",
    },
  },
});

export const title = style({
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "24px",
  color: "var(--color-gray-900)",
  margin: "0 0 16px 0",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "16px",
      lineHeight: "22px",
      margin: "0 0 12px 0",
    },
  },
});

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const moreLinkWrapper = style({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "16px",
  "@media": {
    "(max-width: 768px)": {
      marginTop: "12px",
    },
  },
});

export const moreLink = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
  color: "var(--color-primary-700)",
  backgroundColor: "var(--color-primary-50)",
  textDecoration: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "1px solid var(--color-primary-100)",
  ":hover": {
    backgroundColor: "var(--color-primary-100)",
    borderColor: "var(--color-primary-200)",
    color: "var(--color-primary-800)",
    transform: "translateY(-1px)",
  },

  ":active": {
    transform: "translateY(0)",
  },

  "@media": {
    "(max-width: 768px)": {
      fontSize: "13px",
      lineHeight: "18px",
      marginTop: "12px",
      padding: "8px 16px",
    },
  },
});

export const emptyState = style({
  padding: "32px 16px",
  textAlign: "center",
  fontSize: "14px",
  lineHeight: "20px",
  color: "var(--color-gray-500)",
  "@media": {
    "(max-width: 768px)": {
      padding: "24px 12px",
      fontSize: "13px",
      lineHeight: "18px",
    },
  },
});
