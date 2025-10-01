import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],           
  dts: true,                  // d.ts 함께 생성
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  platform: "neutral",        // node 전용이면 "node"
  splitting: false,           
  minify: false,             
  external: [
    /^@workly\/types/,        // 외부 의존성은 번들에 포함하지 않음
  ],
});
