import { styleVariants, style } from "@vanilla-extract/css";

export const checkboxBase = style({
  appearance: "none",
  outline: "none",
  border: "1px solid var(--color-gray-300)",
  borderRadius: 4,
  background: "#fff",
  display: "inline-block",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  cursor: "pointer",
  position: "relative",
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
  "::after": {
    content: "",
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: 4,
    transition: "background 0.2s",
  },
  selectors: {
    "&:focus": {
      boxShadow: "0 0 0 4px #E0EAFF",
      borderColor: "var(--color-brand-300)",
    },
    "&:disabled": {
      background: "var(--color-gray-100)",
      borderColor: "var(--color-gray-200)",
      cursor: "not-allowed",
    },
  },
});

export const checkboxSize = styleVariants({
  sm: { width: 16, height: 16 },
  md: { width: 20, height: 20 },
  lg: { width: 24, height: 24 },
});

export const checkboxChecked = style({
  background: "var(--color-brand-50)",
  borderColor: "var(--color-brand-600)",
});

export const checkboxContainer = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const checkboxIconWrapper = style({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});
