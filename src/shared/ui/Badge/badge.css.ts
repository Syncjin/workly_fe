import { style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { colorGroups, colorLevels, ColorVariant } from "@/shared/styles/colorVariants";

export const baseBadge = {
  borderRadius: "16px",
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "Pretendard, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
  gap: "4px",
};

export const sizeVariants = styleVariants({
  sm: { padding: "2px 8px", fontSize: "12px", lineHeight: "18px" },
  md: { padding: "2px 10px", fontSize: "14px", lineHeight: "20px" },
  lg: { padding: "4px 12px", fontSize: "14px", lineHeight: "20px" },
});

export type BadgeColor = ColorVariant;

const colorCompoundVariants: {
  variants: { color: BadgeColor };
  style: Record<string, string>;
}[] = [];
colorGroups.forEach((group) => {
  colorLevels.forEach((level) => {
    const color = `${group}-${level}` as BadgeColor;
    colorCompoundVariants.push({
      variants: { color },
      style: {
        backgroundColor: `var(--color-${group}-${level})`,
        color: `var(--color-${group}-700)`,
        border: "none",
      },
    });
  });
});

const placeholder = style({});

export const badgeRecipe = recipe({
  base: baseBadge,
  variants: {
    size: sizeVariants,
    color: Object.fromEntries(colorGroups.flatMap((group) => colorLevels.map((level) => [`${group}-${level}`, placeholder]))) as Record<BadgeColor, string>,
  },
  compoundVariants: colorCompoundVariants,
  defaultVariants: {
    size: "md",
    color: "brand-50",
  },
});
