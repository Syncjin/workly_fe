import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, "../src/assets/images/icons");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg"));

const union = files.map((f) => `'${f.replace(".svg", "")}'`).join(" | ");
const content = `export type IconName = ${union};\n`;

fs.writeFileSync(path.join(dir, "icon-types.ts"), content);
