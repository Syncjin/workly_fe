import { style } from "@vanilla-extract/css";

export const container = style({
  padding: "8px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const filterGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "4px",
});

export const filterButton = style({
  height: "44px",
  padding: "6px 4px",
  borderRadius: "8px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-gray-600)",
  fontWeight: 400,
  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  outline: "none",
  minWidth: 0,
  selectors: {
    "&:hover": {
      background: "var(--color-gray-100)",
      color: "var(--color-gray-800)",
      transform: "translateY(-1px)",
    },
    "&:focus": {
      outline: "none",
    },
    "&:focus-visible": {
      outline: "none",
    },
    "&:active": {
      transform: "translateY(0px)",
      transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "&[data-selected='true']": {
      color: "var(--color-brand-600)",
      fontWeight: 500,
      background: "var(--color-brand-50)",
      transform: "none",
    },
    "&[data-selected='true']:hover": {
      background: "var(--color-brand-100)",
      transform: "none",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "background-color 200ms ease, color 200ms ease",
      selectors: {
        "&:hover": {
          transform: "none",
        },
        "&:active": {
          transform: "none",
        },
      },
    },
  },
});

export const filterContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  width: "100%",
  minWidth: 0,
});

export const filterLabel = style({
  fontSize: "10px",
  lineHeight: "11px",
  textAlign: "center",
  whiteSpace: "nowrap",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const countNumber = style({
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: "14px",
  color: "inherit",
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const iconContainer = style({
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const collapsedContainer = style({
  padding: "8px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  alignItems: "center",
});

export const collapsedFilterButton = style({
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-gray-600)",
  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  fontWeight: 400,
  outline: "none",
  padding: "10px",

  selectors: {
    "&:hover": {
      background: "var(--color-gray-100)",
      color: "var(--color-gray-800)",
      transform: "translateY(-1px)",
    },
    "&:focus": {
      outline: "none",
    },
    "&:focus-visible": {
      outline: "none",
    },
    "&:active": {
      transform: "translateY(0px)",
      transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "&[data-selected='true']": {
      color: "var(--color-brand-600)",
      fontWeight: 500,
      background: "var(--color-brand-50)",
      transform: "none",
    },
    "&[data-selected='true']:hover": {
      background: "var(--color-brand-100)",
      transform: "none",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "background-color 200ms ease, color 200ms ease",
      selectors: {
        "&:hover": {
          transform: "none",
        },
        "&:active": {
          transform: "none",
        },
      },
    },
  },
});

export const collapsedFilterContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
  width: "100%",
});

export const collapsedIconContainer = style({
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const collapsedCountNumber = style({
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: "16px",
  color: "inherit",
  height: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
