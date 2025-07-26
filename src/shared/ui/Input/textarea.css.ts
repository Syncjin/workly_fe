import { styleVariants, style } from "@vanilla-extract/css";

export const baseTextarea = style({
  fontSize: "16px",
  lineHeight: "24px",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid var(--color-gray-300)",
  background: "#fff",
  boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
  outline: "none",
  color: "var(--color-gray-900)",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
  resize: "none",
  selectors: {
   
    "&:disabled": {
      background: "var(--color-gray-50)",
      color: "var(--color-gray-500)",
      borderColor: "var(--color-gray-300)",
      cursor: "not-allowed",
    },
    "&::placeholder": {
      color: "var(--color-gray-500)",
    },
  },
});

export const textareaStatus = styleVariants({
  default: {
    selectors: {
      "&:focus": {
        boxShadow: "0 0 0 4px var(--color-brand-300)",
        background: "#fff",
      },
    },
  },
  success: {
    selectors: {
      "&:focus": {
        boxShadow: "0px 0px 0px 4px #D1FADF",
      },
    },
  },
  error: {
    selectors: {
      "&:focus": {
        boxShadow: "0px 0px 0px 4px #FEE4E2",
      },
    },
  },
});
