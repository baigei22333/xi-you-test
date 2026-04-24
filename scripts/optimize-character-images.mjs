/**
 * 将 public/characters/*.png 转为 WebP（限宽 1280、适当压缩），并删除 PNG。
 * 无 PNG 时直接退出（便于仅含 WebP 的仓库反复 build）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "characters");

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
if (files.length === 0) {
  console.log("optimize-character-images: no PNG in public/characters, skip");
  process.exit(0);
}

for (const f of files) {
  const input = path.join(dir, f);
  const output = path.join(dir, f.replace(/\.png$/i, ".webp"));
  await sharp(input)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 85, effort: 4 })
    .toFile(output);
  fs.unlinkSync(input);
  console.log(`optimized ${f} -> ${path.basename(output)}`);
}
