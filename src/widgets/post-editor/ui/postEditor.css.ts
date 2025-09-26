import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const toolbar = {
  container: style({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "16px 0",
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

export const editor = {
  container: style({
    flex: 1,
    position: "relative",
    minHeight: 240,
  }),
  contentEditable: style({
    outline: "none",
  }),
  placeholder: style({
    position: "absolute",
    color: "var(--color-gray-500)",
    top: 24,
    left: 24,
    pointerEvents: "none",
    userSelect: "none",
  }),
};
