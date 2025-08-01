import { style, styleVariants } from "@vanilla-extract/css";

export const avatarGroupContainer = style({
  display: "flex",
  alignItems: "center",
});

export const avatarGroupItem = style({
  position: "relative",
});

export const avatarGroupOverflowBase = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: "var(--color-brand-50)",
  border: "2px solid #fff",
  color: "var(--color-brand-600)",
  fontWeight: 500,
});

export const avatarGroupOverflow = styleVariants({
  xs: {
    fontSize: 12,
    lineHeight: "18px",
  },
  sm: {
    fontSize: 14,
    lineHeight: "20px",
  },
  md: {
    fontSize: 16,
    lineHeight: "24px",
  },
});
