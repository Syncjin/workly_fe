// window 환경에서는 와일드카드 명령어가 안되어서 스크립트로 적용
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { optimize } from "svgo";

const iconsDir = path.join(process.cwd(), "src/assets/images/icons");
const files = await fg("*.svg", { cwd: iconsDir, absolute: true });

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const result = optimize(original, {
    path: file,
    configFile: path.join(process.cwd(), "svgo.config.js"),
  });

  fs.writeFileSync(file, result.data, "utf8");
  console.log(`Optimized: ${path.basename(file)}`);
}
