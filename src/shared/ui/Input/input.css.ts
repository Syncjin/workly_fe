import { styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { colorGroups, colorLevels, ColorVariant, createColorVariantStyles } from "@/shared/styles/colorVariants";

export const baseInput = {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontWeight: 400,
  fontFamily: "Pretendard, sans-serif",
  outline: "none",
  transition: "border-color 0.2s, background-color 0.2s, color 0.2s",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  // boxSizing: "border-box", // 타입 에러 방지 위해 제거
};

export const sizeVariants = styleVariants({
  sm: {
    padding: "6px 12px",
    fontSize: "14px",
  },
  md: {
    padding: "8px 14px",
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
