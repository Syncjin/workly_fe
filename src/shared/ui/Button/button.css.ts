import { colorGroups, colorLevels, ColorVariant } from "@/shared/styles/colorVariants";
import { keyframes, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const baseButton = {
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Pretendard, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
  position: "relative" as const,
};

export const sizeVariants = styleVariants({
  sm: { padding: "8px 14px", fontSize: "14px", lineHeight: "20px" },
  md: { padding: "10px 16px", fontSize: "14px", lineHeight: "20px" },
  lg: { padding: "10px 18px", fontSize: "16px", lineHeight: "24px" },
  xl: { padding: "12px 20px", fontSize: "16px", lineHeight: "24px" },
});

export type ButtonVariant = "solid" | "light" | "border" | "ghost" | "link";
export type ButtonColor = ColorVariant;

export const buttonContent = style({
  columnGap: "8px",
});

export const iconSlot = style({
  display: "inline-flex",
  width: "2em", // 아이콘/스피너 교체 시 폭 유지
  height: "2em",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

export const label = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const replaceWrap = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
});

export const overlay = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
});


const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const spin1s = style({
  display: "inline-block",
  animation: `${spin} 1s linear infinite`,
});

function getButtonVariantStyle(variant: ButtonVariant, color: ButtonColor) {
  const [group, level] = color.split("-");
  switch (variant) {
    case "solid":
      return {
        backgroundColor: `var(--color-${group}-${level})`,
        color: "#fff",
        border: "none",
        selectors: {
          "&:hover": {
            backgroundColor: `var(--color-${group}-700)`,
          },
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            boxShadow: `
              0 0 0 4px #F4EBFF,
              0 1px 2px 0 rgba(10, 13, 18, 0.05)
            `,
          },
          "&:disabled": {
            backgroundColor: `var(--color-${group}-200)`,
          },
          "&[data-loading]": {
            backgroundColor: `var(--color-${group}-200)`,
          },
        },
      };
    case "light":
      return {
        backgroundColor: `var(--color-${group}-50)`,
        color: `var(--color-${group}-700)`,
        border: "none",
        selectors: {
          "&:hover": {
            backgroundColor: `var(--color-${group}-100)`,
          },
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            boxShadow: `
              0 0 0 4px #E0EAFF,
              0 1px 2px 0 #0A0D120D
            `,
          },
          "&:disabled": {
            backgroundColor: `var(--color-${group}-25)`,
            color: `var(--color-${group}-300)`,
          },
          "&[data-loading]": {
            backgroundColor: `var(--color-${group}-25)`,
            color: `var(--color-${group}-300)`,
          },
        },
      };
    case "border":
      return {
        backgroundColor: "transparent",
        color: `var(--color-${group}-700)`,
        border: `1px solid var(--color-${group}-300)`,
        selectors: {
          "&:hover": {
            backgroundColor: `var(--color-${group}-50)`,
          },
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            boxShadow: `
              0 0 0 4px #F5F5F5,
              0 1px 2px 0 rgba(10, 13, 18, 0.05)
            `,
          },
          "&:disabled": {
            backgroundColor: `var(--color-${group}-200)`,
            color: `var(--color-${group}-300)`,
          },
          "&[data-loading]": {
            backgroundColor: `var(--color-${group}-200)`,
            color: `var(--color-${group}-300)`,
          },
        },
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: `var(--color-${group}-700)`,
        border: "none",
        selectors: {
          "&:hover": {
            backgroundColor: `var(--color-${group}-50)`,
          },
          "&:focus": {
            outline: "none",
          },
          "&:disabled": {
            color: `var(--color-gray-300)`,
          },
          "&[data-loading]": {
            color: `var(--color-gray-300)`,
          },
        },
      };
    case "link":
      return {
        padding: 0,
        backgroundColor: "transparent",
        color: `var(--color-${group}-700)`,
        border: "none",
        selectors: {
          "&:hover": {
            color: `var(--color-${group}-700)`,
          },
          "&:disabled": {
            color: `var(--color-gray-300)`,
          },
          "&[data-loading]": {
            color: `var(--color-gray-300)`,
          },
        },
      };
    default:
      return {};
  }
}

const variantColorCompoundVariants: any[] = [];
colorGroups.forEach((group) => {
  colorLevels.forEach((level) => {
    const color = `${group}-${level}` as ButtonColor;
    (["solid", "light", "border", "ghost", "link"] as ButtonVariant[]).forEach((variant) => {
      variantColorCompoundVariants.push({
        variants: {
          variant,
          color,
        },
        style: getButtonVariantStyle(variant, color),
      });
    });
  });
});

const placeholder = style({});

export const buttonRecipe = recipe({
  base: baseButton,
  variants: {
    size: sizeVariants,
    variant: {
      solid: style({}),
      light: style({}),
      border: style({}),
      ghost: style({}),
      link: style({}),
    },
    color: Object.fromEntries(colorGroups.flatMap((group) => colorLevels.map((level) => [`${group}-${level}`, placeholder]))) as Record<ButtonColor, string>,
  },
  compoundVariants: variantColorCompoundVariants,
  defaultVariants: {
    size: "md",
    variant: "solid",
    color: "brand-600",
  },
});
