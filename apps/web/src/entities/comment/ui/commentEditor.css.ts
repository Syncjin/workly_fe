import { style } from "@vanilla-extract/css";

export const textarea = style({
  width: "100%",
  height: "102px",
});

export const textareaBox = style({
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

export const createBtn = style({
  alignSelf: "flex-end",
  marginTop: 10,
});

export const actionSlot = style({
  display: "flex",
  flexDirection: "row",
  gap: 8,
  justifyContent: "flex-end",
  marginTop: 10,
});
