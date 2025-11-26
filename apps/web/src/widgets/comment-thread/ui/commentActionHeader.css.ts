import { keyframes, style } from "@vanilla-extract/css";

export const container = style({
  padding: "60px 0 0 0",
  display: "flex",
  justifyContent: "space-between",
});

export const reactionBox = style({
  display: "flex",
  flexDirection: "row",
});

export const reactionItem = style({
  display: "flex",
  flexDirection: "row",
});

const popLiked = keyframes({
  "0%": { transform: "scale(1) rotate(0)" },
  "40%": { transform: "scale(1.25) rotate(-12deg)" },
  "100%": { transform: "scale(1) rotate(0)" },
});

const popUnliked = keyframes({
  "0%": { transform: "scale(1) rotate(0)" },
  "40%": { transform: "scale(0.9) rotate(8deg)" },
  "100%": { transform: "scale(1) rotate(0)" },
});

const ringPop = keyframes({
  "0%": { opacity: 0, transform: "scale(0.6)", borderWidth: 0, borderColor: "transparent" },
  "10%": { borderWidth: 2, borderColor: "var(--color-brand-400)" },
  "40%": { opacity: 0.8, transform: "scale(1.2)", borderWidth: 2 },
  "100%": { opacity: 0, transform: "scale(1.5)", borderWidth: 0, borderColor: "transparent" },
});

export const likeWrap = style({
  position: "relative",
  display: "inline-block",
  selectors: {
    '&[data-liked="true"]': {
      animation: `${popLiked} 350ms ease`,
    },
    '&[data-liked="false"]': {
      animation: `${popUnliked} 250ms ease`,
    },
    '&[data-liked="true"]::after': {
      content: "",
      position: "absolute",
      inset: "-2px",
      borderRadius: "9999px",
      pointerEvents: "none",
      borderStyle: "solid",
      borderWidth: 0,
      borderColor: "transparent",
      animation: `${ringPop} 450ms ease 0s 1 both`,
      willChange: "transform, opacity, border-width",
    },
  },
});

export const likeIcon = style({
  display: "inline-flex",
  verticalAlign: "middle",
});
