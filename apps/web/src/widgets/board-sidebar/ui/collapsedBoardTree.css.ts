import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const nav = style({
  width: "100%",
});

export const boardList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const boardItem = style({
  display: "flex",
  justifyContent: "center",
});

export const boardButton = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 150ms ease-in-out",

    selectors: {
      "&:hover": {
        background: "var(--color-gray-200)",
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
  },
  variants: {
    active: {
      true: {
        background: "var(--color-brand-50)",
        selectors: {
          "&:hover": {
            background: "var(--color-brand-100)",
          },
        },
      },
      false: {},
    },
  },
});
