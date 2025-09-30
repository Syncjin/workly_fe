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

export const boardSelector = {
  container: style({
    padding: "16px 0",
    margin: "16px 0",
    gap: 8,
    borderTop: "1px solid var(--color-gray-300)",
    display: "grid",
    gridTemplateColumns: "130px 1fr",
    flexDirection: "column",
  }),
  title: style({
    fontSize: 14,
    fontWeight: 500,
    color: "var(--color-gray-900)",
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
