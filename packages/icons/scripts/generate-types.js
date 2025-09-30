import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgsDir = path.join(__dirname, "../svgs");
const srcDir = path.join(__dirname, "../src");

const files = fs.readdirSync(svgsDir).filter((f) => f.endsWith(".svg"));

// Generate IconName type
const union = files.map((f) => `'${f.replace(".svg", "")}'`).join(" | ");
const typeContent = `export type IconName = ${union};\n`;

// Write types file
fs.writeFileSync(path.join(srcDir, "types.ts"), typeContent);

console.log(`Generated types for ${files.length} icons`);