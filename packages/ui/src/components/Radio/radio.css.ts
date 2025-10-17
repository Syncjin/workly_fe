import { style, styleVariants } from "@vanilla-extract/css";

export const radioBase = style({
  appearance: "none",
  outline: "none",
  border: "1px solid var(--color-gray-300)",
  borderRadius: "50%",
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
    borderRadius: "50%",
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

export const radioSize = styleVariants({
  sm: { width: 16, height: 16 },
  md: { width: 20, height: 20 },
  lg: { width: 24, height: 24 },
});

export const radioChecked = style({
  borderColor: "var(--color-brand-600)",
  background: "#fff",
  selectors: {
    "&:disabled": {
      borderColor: "var(--color-gray-200)",
      background: "#fff",
    },
  },
});

export const radioDot = style({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
  background: "var(--color-brand-600)",
  transition: "background 0.2s",
});

export const radioContainer = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
