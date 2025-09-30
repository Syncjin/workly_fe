import { styleVariants } from "@vanilla-extract/css";

export const inputHintVariants = styleVariants({
  default: {
    color: "var(--color-gray-600)",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
  },
  success: {
    color: "var(--color-success-500)",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
  },
  error: {
    color: "var(--color-error-500)",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
  },
});
