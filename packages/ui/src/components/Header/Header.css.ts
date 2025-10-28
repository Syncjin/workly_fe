// src/widgets/header/Header.css.ts
import { globalStyle, style } from "@vanilla-extract/css";

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

export const centerSection = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
});

export const rightSection = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginRight: "24px",
});

export const iconButton = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  width: "28px",
  height: "28px",
  transition: "background 0.2s",
  selectors: {
    "&:hover": {
      background: "var(--color-brand-500)",
    },
    "&:focus": {
      outline: "2px solid var(--color-brand-300)",
      outlineOffset: "2px",
    },
  },
});

export const menuButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "4px",
  transition: "background 0.2s",
  selectors: {
    "&:hover": {
      background: "var(--color-brand-500)",
    },
    "&:focus": {
      outline: "2px solid var(--color-brand-300)",
      outlineOffset: "2px",
    },
  },
});

// 메뉴 버튼 아이콘 애니메이션을 위한 globalStyle
globalStyle(`${menuButton} svg`, {
  transition: "transform 200ms ease-in-out",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const badge = style({
  position: "absolute",
  top: "-4px",
  right: "-4px",
  minWidth: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: "var(--color-error-500)",
  color: "white",
  fontSize: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
});

export const avatar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: "50%",
  overflow: "hidden",
  transition: "transform 0.2s",
  selectors: {
    "&:hover": {
      transform: "scale(1.05)",
    },
    "&:focus": {
      outline: "2px solid var(--color-brand-300)",
      outlineOffset: "2px",
    },
  },
});
