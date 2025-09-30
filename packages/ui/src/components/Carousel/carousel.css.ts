import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const carouselContainer = style({
  position: "relative",
  overflow: "hidden",
  width: "100%",
});

export const carouselInner = style({
  display: "flex",
  transition: "transform 0.5s ease-in-out",
  width: "100%",
});

export const noTransition = style({
  transition: "none !important", // loop jump 시 사용
});

export const carouselItem = style({
  flex: "0 0 100%",
  width: "100%",
});

export const arrowButton = recipe({
  base: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    size: {
      md: {
        width: "36px",
        height: "36px",
      },
      lg: {
        width: "44px",
        height: "44px",
      },
    },
    color: {
      dark: {},
      light: {},
      brand: {},
    },
  },
  compoundVariants: [
    {
      variants: { color: "dark" },
      style: { backgroundColor: "rgba(0, 0, 0, 0.90)", backdropFilter: "blur(4px)" },
    },
    {
      variants: { color: "light" },
      style: { backgroundColor: "rgba(255, 255, 255, 0.90)", backdropFilter: "blur(4px)", color: "var(--color-gray-700)" },
    },
    {
      variants: { color: "brand" },
      style: { backgroundColor: "var(--color-brand-700)" },
    },
  ],
});

export const dotsWrapper = recipe({
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  variants: {
    size: {
      md: {
        gap: "12px",
      },
      lg: {
        gap: "16px",
      },
    },
  },
});

export const dotsContainer = recipe({
  base: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: 16,
    overflow: "hidden",
  },
  variants: {
    size: {
      md: {
        gap: "12px",
        padding: "8px",
      },
      lg: {
        gap: "16px",
        padding: "12px",
      },
    },
    color: {
      dark: {},
      light: {},
      brand: {},
    },
  },
  compoundVariants: [
    {
      variants: { color: "dark" },
      style: { backgroundColor: "rgba(0, 0, 0, 0.90)", backdropFilter: "blur(4px)" },
    },
    {
      variants: { color: "light" },
      style: { backgroundColor: "rgba(255, 255, 255, 0.90)", backdropFilter: "blur(4px)" },
    },
    {
      variants: { color: "brand" },
      style: { backgroundColor: "var(--color-brand-700)" },
    },
  ],
});

export const dot = recipe({
  base: {
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "opacity 0.3s ease",
  },
  variants: {
    size: {
      md: { width: "8px", height: "8px" },
      lg: { width: "10px", height: "10px" },
    },
    color: {
      dark: {},
      light: {},
      brand: {},
    },
    isActive: {
      true: { opacity: 0 },
      false: { opacity: 1 },
    },
  },
  compoundVariants: [
    {
      variants: { color: "dark", isActive: true },
      style: { backgroundColor: "#fff" },
    },
    {
      variants: { color: "dark", isActive: false },
      style: { backgroundColor: "var(--color-gray-500)" },
    },
    {
      variants: { color: "light", isActive: true },
      style: { backgroundColor: "var(--color-gray-900)" },
    },
    {
      variants: { color: "light", isActive: false },
      style: { backgroundColor: "var(--color-gray-300)" },
    },
    {
      variants: { color: "brand", isActive: true },
      style: { backgroundColor: "#fff" },
    },
    {
      variants: { color: "brand", isActive: false },
      style: { backgroundColor: "var(--color-brand-500)" },
    },
  ],
});

export const activeDotFadeOut = style({
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
});

export const activeDot = recipe({
  base: {
    position: "absolute",
    top: "50%",
    left: 0,
    transform: "translateY(-50%) translateX(-50%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 2,
    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), width 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  },
  variants: {
    size: {
      md: {
        height: "8px",
      },
      lg: {
        height: "10px",
      },
    },
    color: {
      dark: {
        backgroundColor: "#fff",
      },
      light: {
        backgroundColor: "var(--color-gray-900)",
      },
      brand: {
        backgroundColor: "#fff",
      },
    },
  },
});
