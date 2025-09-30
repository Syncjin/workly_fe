// window 환경에서는 와일드카드 명령어가 안되어서 스크립트로 적용
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { optimize } from "svgo";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, "../svgs");
const files = await fg("*.svg", { cwd: iconsDir, absolute: true });

const svgoConfig = {
  plugins: [
    {
      name: "preset-default",
      params: { overrides: { removeViewBox: false } },
    },
    { name: "removeAttrs", params: { attrs: ["fill", "stroke", "color"] } },
    { name: "removeDimensions" },
  ],
};

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const result = optimize(original, {
    path: file,
    ...svgoConfig,
  });

  fs.writeFileSync(file, result.data, "utf8");
  console.log(`Optimized: ${path.basename(file)}`);
}
