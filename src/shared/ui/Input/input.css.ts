import { styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { colorGroups, colorLevels, ColorVariant, createColorVariantStyles } from "@/shared/styles/colorVariants";

export const baseInput = {
  fontSize: "16px",
  lineHeight: "24px",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid var(--color-gray-300)",
  background: "#fff",
  boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
  outline: "none",
  color: "var(--color-gray-900)",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
  selectors: {
    "&:focus": {
      boxShadow: "0 0 0 2px var(--color-brand-300)",
      background: "#fff",
    },
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
    padding: "6px 12px",
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

export const variantStyles = createColorVariantStyles(colorGroups, colorLevels, (group, level) => ({
  backgroundColor: `var(--color-${group}-${level})`,
  color: "#222",
  selectors: {
    "&:focus": {
      borderColor: `var(--color-${group}-${level})`,
    },
  },
}));

export const inputRecipe = recipe({
  base: baseInput,
  variants: {
    size: sizeVariants,
    variant: variantStyles,
  },
  defaultVariants: {
    size: "md",
    variant: "gray-50",
  },
});

export type InputColorVariant = ColorVariant;
