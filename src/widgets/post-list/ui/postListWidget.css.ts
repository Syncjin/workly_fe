import { style } from "@vanilla-extract/css";

export const header = style({
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "30px",
  color: "#000",
});

export const container = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const listView = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 8,
  marginTop: 24,
  borderTopWidth: "1px",
  borderTopColor: "var(--color-gray-300)",
  borderTopStyle: "solid",
});

export const toolbar = {
  container: style({
    marginTop: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }),
  leftArea: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }),
  rightArea: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  }),
};
