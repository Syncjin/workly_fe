import { style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { colorGroups, colorLevels, type ColorVariant } from "../../theme/colorTokens";
import { buildVariantMap } from "../../theme/colorVariants";

export const baseInput = {
  lineHeight: "24px",
  borderRadius: "8px",
  border: "1px solid var(--color-gray-300)",
  background: "#fff",
  boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
  outline: "none",
  color: "var(--color-gray-900)",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
  selectors: {
    "&:disabled": {
      background: "var(--color-gray-50)",
      color: "var(--color-gray-500)",
      borderColor: "var(--color-gray-300)",
      cursor: "not-allowed",
    },
    "&::placeholder": {
      color: "var(--color-gray-500)",
    },
  },
};

export const sizeVariants = styleVariants({
  sm: {
    padding: "10px 14px",
    fontSize: "14px",
  },
  md: {
    padding: "10px 14px",
    fontSize: "16px",
  },
  lg: {
    padding: "10px 16px",
    fontSize: "18px",
  },
  xl: {
    padding: "12px 18px",
    fontSize: "20px",
  },
});

export const variantStyles = buildVariantMap(colorGroups, colorLevels, (group, level) =>
  style({
    backgroundColor: `var(--color-${group}-${level})`,
    color: "#222",
    selectors: {
      "&:focus": {
        borderColor: `var(--color-${group}-${level})`,
      },
    },
  })
);

export const inputStatus = styleVariants({
  default: {
    selectors: {
      "&:focus": {
        boxShadow: "0 0 0 4px var(--color-brand-300)",
        background: "#fff",
      },
    },
  },
  success: {
    selectors: {
      "&:focus": {
        boxShadow: "0px 0px 0px 4px #D1FADF",
      },
    },
  },
  error: {
    selectors: {
      "&:focus": {
        boxShadow: "0px 0px 0px 4px #FEE4E2",
      },
    },
  },
});

export const inputRecipe = recipe({
  base: baseInput,
  variants: {
    size: sizeVariants,
    variant: variantStyles,
    status: inputStatus,
  },
  defaultVariants: {
    size: "md",
    variant: "gray-50",
    status: "default",
  },
});

export type InputColorVariant = ColorVariant;
