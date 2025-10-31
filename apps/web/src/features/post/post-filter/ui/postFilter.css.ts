import { style } from "@vanilla-extract/css";

export const pageSizeSelector = style({
  display: "inline-block",
  width: "110px",
  "@media": {
    "screen and (max-width: 768px)": {
      width: "90px",
    },
    "screen and (max-width: 480px)": {
      width: "100%",
      minWidth: "90px",
    },
  },
});

export const filterDropdown = style({
  display: "inline-block",
  position: "relative",
  width: "38px",
});

export const filterIconTrigger = style({
  padding: "8px",
  minWidth: "38px",
  maxWidth: "38px",
  width: "38px",
  height: "38px",
  justifyContent: "center",
  gap: "0",
  boxSizing: "border-box",
});

export const pageSizeTrigger = style({
  minWidth: "110px",
  width: "110px",
  height: "38px",
  padding: "8px 14px",
  fontSize: "14px",
  lineHeight: "20px",
  boxSizing: "border-box",
  "@media": {
    "screen and (max-width: 768px)": {
      minWidth: "90px",
      width: "90px",
    },
  },
});

export const filterMenu = style({
  minWidth: "120px",
  width: "120px",
  left: "auto",
  right: "0",
});
