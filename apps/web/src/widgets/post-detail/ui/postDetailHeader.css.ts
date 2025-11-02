import { globalStyle, style } from "@vanilla-extract/css";

export const profile = style({
  width: 40,
  height: 40,
});

export const container = style({
  display: "flex",
  flexDirection: "column",
});

export const titleArea = style({
  display: "flex",
  flexDirection: "row",
  padding: "18px 0 13px",
  justifyContent: "space-between",
});
globalStyle(`${titleArea} h3`, {
  fontSize: 24,
  lineHeight: "34px",
});

export const checkStar = style({
  width: 30,
  height: 30,
});

export const headerArea = style({
  display: "block",
  flex: "1 1 auto",
  marginBottom: 16,
});
export const avatar = style({
  float: "left",
  marginRight: 12,
});
export const name = style({
  display: "flex",
  marginBottom: 4,
  paddingTop: 2,
});
export const date = style({
  display: "inline-block",
  fontSize: 12,
  color: "var(--color-gray-500)",
});
export const read = style({
  display: "inline-block",
  position: "relative",
  fontSize: 12,
  paddingLeft: 10,
  color: "#118dff",
  selectors: {
    "&:before": {
      position: "absolute",
      top: "50%",
      left: 4,
      width: 2,
      height: 2,
      backgroundColor: "#d4d8dc",
      transform: "translateY(-50%)",
      content: "",
    },
  },
});
