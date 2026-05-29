/**
 * Generates WebP thumbnails under public/images/thumbs/ for faster gallery loads.
 * Full-size originals in public/images/ are still used for the lightbox.
 *
 * Usage: npm run images:optimize
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const THUMBS_DIR = path.join(IMAGES_DIR, "thumbs");

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
const GALLERY_MAX_WIDTH = 960;
const HERO_NAMES = new Set(["cover"]);
const HERO_MAX_WIDTH = 1920;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "thumbs") continue;
      files.push(...(await walk(fullPath)));
    } else if (IMAGE_EXT.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeFile(filePath) {
  const relative = path.relative(IMAGES_DIR, filePath);
  const baseName = path.basename(relative, path.extname(relative));
  const relativeDir = path.dirname(relative);
  const outDir =
    relativeDir === "." ? THUMBS_DIR : path.join(THUMBS_DIR, relativeDir);
  const outPath = path.join(outDir, `${baseName}.webp`);

  await ensureDir(outDir);

  const isHero = HERO_NAMES.has(baseName.toLowerCase());
  const maxWidth = isHero ? HERO_MAX_WIDTH : GALLERY_MAX_WIDTH;

  await sharp(filePath)
    .rotate()
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(outPath);

  const [srcStat, outStat] = await Promise.all([
    fs.stat(filePath),
    fs.stat(outPath),
  ]);

  return {
    relative,
    out: path.relative(ROOT, outPath),
    savedKb: Math.round((srcStat.size - outStat.size) / 1024),
  };
}

async function main() {
  const files = await walk(IMAGES_DIR);

  if (!files.length) {
    console.log("No images found in public/images/");
    return;
  }

  console.log(`Optimizing ${files.length} image(s)...`);

  let totalSaved = 0;
  for (const file of files) {
    const result = await optimizeFile(file);
    totalSaved += result.savedKb;
    console.log(`  ${result.relative} → ${result.out} (−${result.savedKb} KB)`);
  }

  console.log(`Done. Estimated bandwidth saved vs originals: ~${Math.round(totalSaved / 1024)} MB per full gallery load.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
