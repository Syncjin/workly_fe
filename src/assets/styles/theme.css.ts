import { createGlobalTheme, globalStyle } from "@vanilla-extract/css";

// 의미변수(semantic) — 기존 globals의 --background / --foreground 대체
export const themeVars = {
  background: "--background",
  foreground: "--foreground",
  font: {
    sans: "--font-sans",
    mono: "--font-mono",
  },
} as const;

// :root에 semantic 변수 기본값 주입 (light 기본)
createGlobalTheme(":root", {
  [themeVars.background]: "#ffffff",
  [themeVars.foreground]: "#0a0a0a",
  [themeVars.font.sans]: "var(--font-geist-sans)",
  [themeVars.font.mono]: "var(--font-geist-mono)",
});

// 시스템 다크모드 미디어 쿼리
globalStyle(":root", {
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: {
        [themeVars.background]: "#0a0a0a",
        [themeVars.foreground]: "#ededed",
      },
    },
  },
});
