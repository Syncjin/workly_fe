import { style } from "@vanilla-extract/css";

import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const selectContainer = style({
  display: "inline-block",
  position: "relative",
});

export const trigger = recipe({
  base: {
    padding: "10px 14px",
    border: "1px solid var(--color-gray-300)",
    borderRadius: "8px",
    backgroundColor: "#fff",
    cursor: "pointer",
    minWidth: "320px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    transition: "box-shadow 0.2s",
  },
  variants: {
    focused: {
      true: {
        boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05), 0 0 0 4px #E0EAFF",
      },
      false: {
        boxShadow: "none",
      },
    },
  },
});

export const menu = style({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  marginTop: "12px",
  backgroundColor: "#fff",
  border: "1px solid var(--color-gray-200)",
  borderRadius: "8px",
  boxShadow:
    "0 12px 16px -4px rgba(10, 13, 18, 0.08), 0 4px 6px -2px rgba(10, 13, 18, 0.03)",
  zIndex: 10,
});

export const option = recipe({
  base: {
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    selectors: {
      '&:hover': {
        backgroundColor: "var(--color-gray-50)",
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "var(--color-gray-50)",
      },
    },
  },
});

export const optionContent = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    // gap: "8px",
  },
  variants: {
    visualType: {
      icon: {},
      dot: {
        // gap: "12px",
      },
      avatar: {
        // gap: "12px",
      },
    },
  },
});

export const leftVisual = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const dot = style({
  width: 8,
  height: 8,
  borderRadius: "50%",
  flexShrink: 0,
});

export const leftIcon = style({
  flexShrink: 0,
  display: "flex",
});

export const centerText = style({
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  alignItems: "center",
  justifyContent: "center",
});

export const mainText = style({
    fontSize: "16px",
    color: "var(--color-gray-900)",
    lineHeight: "24px",
    fontWeight: 500,
});

export const subText = style({
  fontSize: "16px",
  color: "var(--color-gray-600)",
  lineHeight: "24px",
  fontWeight: 400,
});

export const placeholder = style({
  color: "var(--color-gray-500)",
  fontSize: "16px",
  lineHeight: "24px"
});