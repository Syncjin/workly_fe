import { styleVariants, style } from "@vanilla-extract/css";

export const avatarBase = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "var(--color-gray-50)",
  border: "1px solid var(--color-gray-200)",
  transition: "border-color 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 4px var(--color-brand-100)",
    },
    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 4px var(--color-brand-100)",
    },
  },
});

export const avatarSize = styleVariants({
  xs: { width: 24, height: 24 },
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 56, height: 56 },
  "2xl": { width: 64, height: 64 },
});

export const avatarImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "50%",
  overflow: "hidden",
});

export const avatarIcon = style({
  color: "var(--color-gray-500)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const avatarDot = style({
  position: "absolute",
  bottom: 0,
  right: 0,
  width: 8,
  height: 8,
  borderRadius: "50%",
  border: "1.5px solid #fff",
  background: "var(--color-success-500)",
  zIndex: 1,
});

export const avatarDotSize = styleVariants({
  xs: { width: 6, height: 6 },
  sm: { width: 8, height: 8 },
  md: { width: 10, height: 10 },
  lg: { width: 12, height: 12 },
  xl: { width: 14, height: 14 },
  "2xl": { width: 16, height: 16 },
});

export const avatarIconSize = styleVariants({
  xs: { width: 10, height: 10 },
  sm: { width: 12, height: 12 },
  md: { width: 14, height: 14 },
  lg: { width: 16, height: 16 },
  xl: { width: 18, height: 18 },
  "2xl": { width: 20, height: 20 },
}); 