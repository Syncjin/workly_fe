import { globalFontFace } from "@vanilla-extract/css";

const base = "/fonts";

const weights = [
  { w: 100, name: "Thin" },
  { w: 200, name: "ExtraLight" },
  { w: 300, name: "Light" },
  { w: 400, name: "Regular" },
  { w: 500, name: "Medium" },
  { w: 600, name: "SemiBold" },
  { w: 700, name: "Bold" },
  { w: 800, name: "ExtraBold" },
  { w: 900, name: "Black" },
] as const;

for (const { w, name } of weights) {
  globalFontFace("Pretendard", {
    src: `
      url("${base}/Pretendard-${name}.woff2") format("woff2"),
      url("${base}/Pretendard-${name}.woff") format("woff")
    `,
    fontStyle: "normal",
    fontWeight: w as number,
    fontDisplay: "swap",
  });
}
