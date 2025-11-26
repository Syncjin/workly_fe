import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { components } from "../../theme/layers.css";

/* --- Animations --- */
const fadeIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0.95)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

const fadeOut = keyframes({
  "0%": { opacity: 1, transform: "scale(1)" },
  "100%": { opacity: 0, transform: "scale(0.95)" },
});

const slideInFromTop = keyframes({
  "0%": { opacity: 0, transform: "translateY(-10px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideInFromBottom = keyframes({
  "0%": { opacity: 0, transform: "translateY(10px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const overlay = recipe({
  base: {
    "@layer": {
      [components]: {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
        boxSizing: "border-box",
        opacity: 1,
        visibility: "visible",
        contain: "layout style paint",
        willChange: "opacity",
      },
    },
  },
  variants: {
    variant: {
      modal: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      tooltip: { backgroundColor: "transparent", pointerEvents: "none" },
      dropdown: { backgroundColor: "transparent", position: "absolute", zIndex: 9999 },
    },
  },
  defaultVariants: { variant: "modal" },
});

const basePopup = style({
  "@layer": {
    [components]: {
      backgroundColor: "white",
      borderRadius: "8px",
      position: "relative",
      outline: "none",
      willChange: "transform, opacity",
      transform: "scale(0.95)",
      opacity: 0,
      maxHeight: "90vh",
      overflow: "auto",
      boxSizing: "border-box",
      "@media": { "(prefers-reduced-motion: reduce)": { animation: "none !important" } },
      selectors: {
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "var(--color-gray-200)", borderRadius: "8px" },
      },
    },
  },
});

export const header = style({
  "@layer": {
    [components]: {
      padding: "20px 24px 16px",
      borderBottom: "1px solid var(--color-gray-200)",
      fontSize: "18px",
      fontWeight: 600,
      color: "var(--color-gray-900)",
    },
  },
});

export const body = style({
  "@layer": { [components]: { padding: "20px 24px" } },
});

export const footer = style({
  "@layer": {
    [components]: {
      padding: "16px 24px 20px",
      borderTop: "1px solid var(--color-gray-200)",
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
    },
  },
});

export const loadingContainer = style({
  "@layer": { [components]: { display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", minHeight: "120px" } },
});

export const spinner = style({
  "@layer": {
    [components]: {
      width: "24px",
      height: "24px",
      border: "2px solid var(--color-gray-200)",
      borderTop: "2px solid var(--color-brand-600)",
      borderRadius: "50%",
      animation: `${spin} 1s linear infinite`,
      "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
    },
  },
});

export const popupRecipe = recipe({
  base: basePopup,
  variants: {
    variant: {
      modal: {
        minWidth: "320px",
        maxWidth: "90vw",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        border: "1px solid var(--color-gray-200)",
      },
      tooltip: {
        padding: "8px 12px",
        fontSize: "14px",
        lineHeight: "20px",
        backgroundColor: "var(--color-gray-900)",
        color: "white",
        borderRadius: "6px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        maxWidth: "320px",
        pointerEvents: "auto",
      },
      dropdown: {
        minWidth: "200px",
        padding: "8px 0",
        border: "1px solid var(--color-gray-200)",
        boxShadow: "0 12px 16px -4px rgba(10,13,18,0.08), 0 4px 6px -2px rgba(10,13,18,0.03)",
        pointerEvents: "auto",
      },
    },
    size: {
      sm: { maxWidth: "320px" },
      md: { maxWidth: "480px" },
      lg: { maxWidth: "640px" },
      xl: { maxWidth: "800px" },
      auto: { maxWidth: "none" },
    },
    position: {
      top: { alignSelf: "flex-start", marginTop: "20px" },
      bottom: { alignSelf: "flex-end", marginBottom: "20px" },
      left: { alignSelf: "center", marginRight: "auto", marginLeft: "20px" },
      right: { alignSelf: "center", marginLeft: "auto", marginRight: "20px" },
      center: { alignSelf: "center" },
    },
    state: {
      open: { animation: `${fadeIn} 200ms ease-out forwards` },
      closed: { animation: `${fadeOut} 200ms ease-in forwards` },
    },
  },
  compoundVariants: [
    { variants: { variant: "tooltip", state: "open" }, style: { animation: `${slideInFromTop} 150ms ease-out forwards` } },
    { variants: { variant: "dropdown", state: "open" }, style: { animation: `${slideInFromBottom} 150ms ease-out forwards` } },
  ],
  defaultVariants: { variant: "modal", size: "md", position: "center", state: "closed" },
});
