import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const BORDEAUX = "#7A1E2A";
const CREAM = "#FAF6EE";
const GOLD = "#C9A24A";

function iconSvg({ size, maskable = false }) {
  const padding = maskable ? size * 0.1 : size * 0.05;
  const inner = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const ringR = inner * 0.45;
  const fontSize = inner * 0.6;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BORDEAUX}"/>
  <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="${GOLD}" stroke-width="${size * 0.015}" opacity="0.85"/>
  <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}" font-weight="500" fill="${CREAM}">T</text>
</svg>`;
}

async function gen(name, size, opts = {}) {
  const svg = iconSvg({ size, maskable: opts.maskable });
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(outDir, name), buf);
  console.log("✓", name);
}

await gen("icon-192.png", 192);
await gen("icon-512.png", 512);
await gen("icon-192-maskable.png", 192, { maskable: true });
await gen("icon-512-maskable.png", 512, { maskable: true });
await gen("apple-touch-icon.png", 180);
await gen("apple-touch-icon-152.png", 152);
await gen("apple-touch-icon-167.png", 167);
await gen("favicon-32.png", 32);
await gen("favicon-16.png", 16);

async function splash(name, w, h) {
  const fontSize = Math.min(w, h) * 0.18;
  const ringR = Math.min(w, h) * 0.18;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${BORDEAUX}"/>
  <circle cx="${w / 2}" cy="${h / 2}" r="${ringR}" fill="none" stroke="${GOLD}" stroke-width="${Math.min(w, h) * 0.006}" opacity="0.85"/>
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="${CREAM}">T</text>
  <text x="${w / 2}" y="${h / 2 + ringR + fontSize * 0.45}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${fontSize * 0.32}" fill="${CREAM}" opacity="0.85" letter-spacing="6">TASTY</text>
</svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(outDir, name), buf);
  console.log("✓", name);
}

await splash("apple-splash-2048-2732.png", 2048, 2732);
await splash("apple-splash-1668-2388.png", 1668, 2388);
await splash("apple-splash-1536-2048.png", 1536, 2048);
await splash("apple-splash-1290-2796.png", 1290, 2796);
await splash("apple-splash-1179-2556.png", 1179, 2556);
await splash("apple-splash-1170-2532.png", 1170, 2532);
await splash("apple-splash-1125-2436.png", 1125, 2436);
await splash("apple-splash-828-1792.png", 828, 1792);
await splash("apple-splash-750-1334.png", 750, 1334);

console.log("✅ Done");
