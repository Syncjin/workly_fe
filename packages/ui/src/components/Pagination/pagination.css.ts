import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  justifyContent: "center",
  padding: "12px 0",
});

export const list = style({
  display: "flex",
  gap: 2,
  alignItems: "center",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const item = style({
  width: 40,
  height: 40,
  padding: "0",
  borderRadius: "50%",
  background: "#fff",
  cursor: "pointer",
  fontSize: 14,
  color: "var(--color-gray-500)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  selectors: {
    "&:hover": { background: "var(--color-gray-100)" },
    "&[disabled]": {
      opacity: 0.45,
    },
    '&[data-active="true"]': {
      background: "var(--color-gray-50)",
      color: "var(--color-brand-500)",
      fontWeight: 600,
    },
    "&[data-nav-type='first']": {},
    "&[data-nav-type='prev']": {
      marginRight: 10,
    },
    "&[data-nav-type='next']": {
      marginLeft: 10,
    },
    "&[data-nav-type='last']": {},
  },
});

export const ellipsis = style({
  minWidth: 24,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#9ca3af",
  userSelect: "none",
});

export const navigationItem = style({
  width: 20,
  height: 20,
  selectors: {
    "&[data-nav-type='first']": {
      marginRight: 20,
    },
    "&[data-nav-type='prev']": {
      marginRight: 20,
    },
    "&[data-nav-type='next']": {
      marginLeft: 20,
      marginRight: 20,
    },
    "&[data-nav-type='last']": {
      marginLeft: 20,
    },
  },
});
