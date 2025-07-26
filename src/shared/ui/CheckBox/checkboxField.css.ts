import { style } from "@vanilla-extract/css";

export const fieldWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
//   gap: 4,
});

export const descriptionStyle = style({
  fontSize: 14,
  color: "var(--color-gray-600)",
  lineHeight: "20px",
}); 