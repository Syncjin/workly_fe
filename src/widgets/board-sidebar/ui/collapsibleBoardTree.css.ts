import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const nav = style({
  padding: "4px 8px 16px",
  flex: 1,
});
export const rootList = style({ listStyle: "none", margin: 0, padding: 0 });
export const categoryItem = style({ marginBottom: 6 });


export const headerButton = recipe({
  base: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    userSelect: "none",
    selectors: {
      "&:hover": { background: "var(--color-gray-200)" },
    },
  },
  variants: {
    open: {
      true: {},
      false: {},
    },
  },
});


export const headerText = style({
  fontWeight: 600,
  color: "var(--color-gray-900)",
  fontSize: 14,
});
export const panel = style({ paddingTop: 6 });
export const boardList = style({ listStyle: "none", margin: 0, padding: 0 });
export const boardItem = style({ margin: 0 });


export const boardButton = recipe({
  base: {
    width: "100%",
    borderRadius: 8,
    padding: "5px 16px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: 4,
    textDecoration: "none",
    background: "transparent",
    fontSize: 14,
    lineHeight: "20px",
    color: "var(--color-gray-600)",
    border: "none",
    cursor: "pointer",
    selectors: {
      "&:hover": { background: "var(--color-gray-200)" },
      '&[aria-current="true"]': {
        background: "#eef2ff",
        color: "#1d4ed8",
        fontWeight: 600,
      },
    },
  },
  variants: {
    active: {
      true: {
        background: "var(--color-brand-50)",
        color: "var(--color-brand-500)",
      },
      false: {},
    },
  },
});

export const boardText = style({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
});


export const chevron = style({
  marginRight: 8,
  transition: "transform 0.18s ease",
  selectors: {
    '&[data-open="true"]': { transform: "rotate(90deg)" },
  },
});