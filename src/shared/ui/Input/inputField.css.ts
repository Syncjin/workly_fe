import { style } from "@vanilla-extract/css";

export const fieldWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

export const labelStyle = style({
  fontSize: 14,
  fontWeight: 500,
  color: "var(--color-gray-700)",
  lineHeight: "20px",
});

export const descriptionStyle = style({
  fontSize: 14,
  color: "var(--color-gray-600)",
  lineHeight: "20px",
}); 