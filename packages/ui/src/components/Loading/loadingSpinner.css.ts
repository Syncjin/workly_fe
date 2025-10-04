import { keyframes, style, styleVariants } from "@vanilla-extract/css";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const wrapper = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const spinner = style({
  display: "inline-block",
  borderRadius: "50%",
  borderStyle: "solid",
  borderColor: "var(--color-gray-200)",
  borderTopColor: "currentColor",
  vars: { ["--spinner-bw"]: "3px" },
  borderWidth: "var(--spinner-bw)",
  animation: `${spin} 0.8s linear infinite`,
});

export const size = styleVariants({
  sm: { width: 16, height: 16 },
  md: { width: 20, height: 20 },
  lg: { width: 28, height: 28 },
});

export const thickness = styleVariants({
  thin: { vars: { ["--spinner-bw"]: "2px" } },
  normal: { vars: { ["--spinner-bw"]: "3px" } },
  thick: { vars: { ["--spinner-bw"]: "4px" } },
});

export const srOnly = style({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});
