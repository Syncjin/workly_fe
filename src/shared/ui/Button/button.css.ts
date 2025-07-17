import { styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { colorGroups, colorLevels, ColorVariant, createColorVariantStyles } from "@/shared/styles/colorVariants";

export const baseButton = {
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s, color 0.2s",
  fontFamily: "Pretendard, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export const sizeVariants = styleVariants({
  sm: {
    padding: "8px 14px",
    fontSize: "14px",
  },
  md: {
    padding: "10px 16px",
    fontSize: "14px",
  },
  lg: {
    padding: "10px 18px",
    fontSize: "16px",
  },
  xl: {
    padding: "12px 20px",
    fontSize: "16px",
  },
});

export const variantStyles = createColorVariantStyles(colorGroups, colorLevels, (group, level) => ({
  backgroundColor: `var(--color-${group}-${level})`,
  selectors: {
    "&:hover": {
      opacity: 0.9,
    },
  },
}));

export const textColorStyles = createColorVariantStyles(colorGroups, colorLevels, (group, level) => ({
  color: `var(--color-${group}-${level})`,
}));

export const buttonRecipe = recipe({
  base: baseButton,
  variants: {
    size: sizeVariants,
    variant: variantStyles,
    textColor: textColorStyles,
  },
  defaultVariants: {
    size: "md",
    variant: "brand-500",
    textColor: "gray-900",
  },
});

export type ButtonColorVariant = ColorVariant;
