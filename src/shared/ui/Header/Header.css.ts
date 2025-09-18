// src/widgets/header/Header.css.ts
import { style } from "@vanilla-extract/css";

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "60px",
  backgroundColor: "var(--color-brand-600)",
  boxSizing: "border-box",
  borderBottom: "1px solid #eee",
  width: "100%",
});

export const leftSection = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginLeft: "24px",
  justifyContent: "center",
  flexDirection: "row",
});

export const logo = style({
  cursor: "pointer",
  marginTop: "4px",
});

export const rightSection = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginRight: "24px",
});

export const iconButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  cursor: "pointer",
  width: "28px",
  height: "28px",
  transition: "background 0.2s",
  selectors: {
    "&:hover": {
      background: "var(--color-brand-500)",
    },
  },
});
