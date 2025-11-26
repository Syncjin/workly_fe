import { style, styleVariants } from "@vanilla-extract/css";

export const container = style({
  position: "relative",
  display: "inline-block",
});

export const tooltip = style({
  position: "absolute",
  zIndex: 1000,
  padding: "8px 12px",
  backgroundColor: "var(--color-gray-900)",
  color: "white",
  fontSize: "12px",
  fontWeight: 500,
  borderRadius: "6px",
  whiteSpace: "nowrap",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  opacity: 0,
  transform: "scale(0.95)",
  transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out",
  pointerEvents: "none",

  selectors: {
    "&[data-visible='true']": {
      opacity: 1,
      transform: "scale(1)",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const tooltipPosition = styleVariants({
  top: {
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%) translateY(-4px) scale(0.95)",
    selectors: {
      "&[data-visible='true']": {
        transform: "translateX(-50%) translateY(-4px) scale(1)",
      },
    },
  },
  right: {
    left: "100%",
    top: "50%",
    transform: "translateY(-50%) translateX(4px) scale(0.95)",
    selectors: {
      "&[data-visible='true']": {
        transform: "translateY(-50%) translateX(4px) scale(1)",
      },
    },
  },
  bottom: {
    top: "100%",
    left: "50%",
    transform: "translateX(-50%) translateY(4px) scale(0.95)",
    selectors: {
      "&[data-visible='true']": {
        transform: "translateX(-50%) translateY(4px) scale(1)",
      },
    },
  },
  left: {
    right: "100%",
    top: "50%",
    transform: "translateY(-50%) translateX(-4px) scale(0.95)",
    selectors: {
      "&[data-visible='true']": {
        transform: "translateY(-50%) translateX(-4px) scale(1)",
      },
    },
  },
});

export const arrow = style({
  position: "absolute",
  width: 0,
  height: 0,
  borderStyle: "solid",
});

export const arrowPosition = styleVariants({
  top: {
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    borderWidth: "4px 4px 0 4px",
    borderColor: "var(--color-gray-900) transparent transparent transparent",
  },
  right: {
    right: "100%",
    top: "50%",
    transform: "translateY(-50%)",
    borderWidth: "4px 4px 4px 0",
    borderColor: "transparent var(--color-gray-900) transparent transparent",
  },
  bottom: {
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    borderWidth: "0 4px 4px 4px",
    borderColor: "transparent transparent var(--color-gray-900) transparent",
  },
  left: {
    left: "100%",
    top: "50%",
    transform: "translateY(-50%)",
    borderWidth: "4px 0 4px 4px",
    borderColor: "transparent transparent transparent var(--color-gray-900)",
  },
});
