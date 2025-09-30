import { keyframes, style } from "@vanilla-extract/css";

// Shimmer
const shimmerKF = keyframes({
  "0%": { backgroundPosition: "-200% 0" },
  "100%": { backgroundPosition: "200% 0" },
});

// Pulse
const pulseKF = keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.6 },
  "100%": { opacity: 1 },
});

// 기본 박스 (기존 스타일 유지)
export const container = style({
  display: "block",
  position: "relative",
  margin: 16,
  borderRadius: 4,
  background: "rgba(0,0,0,.06)",
  boxSizing: "content-box",
});

// 애니메이션 variants
export const shimmer = style({
  // 배경을 그라디언트로 바꿔서 이동시키는 방식
  background: "linear-gradient(90deg, rgba(0,0,0,.06) 25%, rgba(0,0,0,.12) 37%, rgba(0,0,0,.06) 63%)",
  backgroundSize: "200% 100%",
  animation: `${shimmerKF} 1.2s ease-in-out infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      background: "linear-gradient(90deg, rgba(0,0,0,.09) 0%, rgba(0,0,0,.09) 100%)", // 고정톤
    },
  },
});

export const pulse = style({
  animation: `${pulseKF} 1.4s ease-in-out infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const rounded = {
  sm: style({ borderRadius: 4 }),
  md: style({ borderRadius: 8 }),
  lg: style({ borderRadius: 12 }),
  full: style({ borderRadius: 9999 }),
};
