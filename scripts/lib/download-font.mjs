#!/usr/bin/env node

/**
 * Downloads Google Fonts TTF files into a brand's assets/fonts/ directory.
 *
 * Usage:
 *   node scripts/lib/download-font.mjs --brand mybrand --font "Inter"
 *   node scripts/lib/download-font.mjs --brand mybrand --font "Montserrat" --weights "400,700,900"
 *
 * Downloads all available weights by default, or specific weights if --weights is provided.
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name) {
  const flag = args.find((a) => a.startsWith(`--${name}=`));
  if (flag) return flag.split("=").slice(1).join("=");
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : null;
}

const brandName = getArg("brand");
const fontFamily = getArg("font");
const weightsArg = getArg("weights");

if (!brandName || !fontFamily) {
  console.error('Usage: node scripts/lib/download-font.mjs --brand <name> --font "Font Name"');
  console.error('  Optional: --weights "400,700,900"');
  process.exit(1);
}

const brandDir = path.join(ROOT, "brand", brandName);
const fontsDir = path.join(brandDir, "assets", "fonts");

if (!fs.existsSync(brandDir)) {
  console.error(`Brand directory not found: ${brandDir}`);
  console.error(`Run 'node scripts/init-brand.mjs ${brandName}' first.`);
  process.exit(1);
}

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const WEIGHT_NAMES = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    const doFetch = (u) => {
      https.get(u, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doFetch(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }).on("error", reject);
    };
    doFetch(url);
  });
}

async function main() {
  const targetWeights = weightsArg
    ? weightsArg.split(",").map((w) => w.trim())
    : Object.keys(WEIGHT_NAMES);

  const familyEncoded = fontFamily.replace(/\s+/g, "+");
  console.log(`Downloading "${fontFamily}" for brand "${brandName}"...\n`);

  // Fetch the CSS from Google Fonts API with TTF user agent
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyEncoded}:wght@${targetWeights.join(";")}&display=swap`;

  let css;
  try {
    css = (await fetch(cssUrl)).toString();
  } catch (e) {
    console.error(`Failed to fetch font CSS. Is "${fontFamily}" a valid Google Font?`);
    console.error(`Browse available fonts at: https://fonts.google.com`);
    process.exit(1);
  }

  // Parse TTF/WOFF2 URLs and weights from CSS
  const fontRegex = /font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)/g;
  let match;
  const downloads = [];

  while ((match = fontRegex.exec(css))) {
    const weight = match[1];
    const url = match[2];
    if (targetWeights.includes(weight)) {
      downloads.push({ weight, url });
    }
  }

  if (downloads.length === 0) {
    // Try alternate CSS format
    const altRegex = /url\(([^)]+)\)\s*format\(['"]?(\w+)['"]?\)[\s\S]*?font-weight:\s*(\d+)/g;
    while ((match = altRegex.exec(css))) {
      const weight = match[3];
      const url = match[1];
      if (targetWeights.includes(weight)) {
        downloads.push({ weight, url });
      }
    }
  }

  if (downloads.length === 0) {
    console.error("Could not parse font URLs from Google Fonts CSS.");
    console.error("Available weights may differ. Try specifying --weights explicitly.");
    console.error(`\nCSS response:\n${css.slice(0, 500)}`);
    process.exit(1);
  }

  for (const { weight, url } of downloads) {
    const weightName = WEIGHT_NAMES[weight] || weight;
    const sanitizedFamily = fontFamily.replace(/\s+/g, "");
    const ext = url.includes(".woff2") ? ".woff2" : url.includes(".otf") ? ".otf" : ".ttf";
    const filename = `${sanitizedFamily}-${weightName}${ext}`;
    const filePath = path.join(fontsDir, filename);

    try {
      const data = await fetch(url);
      fs.writeFileSync(filePath, data);
      console.log(`  OK: ${filename} (${weight})`);
    } catch (e) {
      console.error(`  FAIL: ${filename} - ${e.message}`);
    }
  }

  console.log(`\nFonts saved to: ${fontsDir}`);
  console.log(`\nAdd to your brand.md Typography section:`);
  console.log(`  ### Primary Font: ${fontFamily}`);
  for (const { weight } of downloads) {
    const weightName = WEIGHT_NAMES[weight] || weight;
    const sanitizedFamily = fontFamily.replace(/\s+/g, "");
    console.log(`  - **${weightName} (${weight})**: \`assets/fonts/${sanitizedFamily}-${weightName}.ttf\``);
  }
}

main().catch(console.error);
