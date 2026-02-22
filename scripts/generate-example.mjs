/**
 * Example script — generates a simple Instagram post using the _example brand.
 * Demonstrates the basic pattern: load brand → build HTML → screenshot with Puppeteer.
 *
 * Usage: node scripts/generate-example.mjs --brand _example
 */

import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import {
  loadBrand,
  ensureDir,
  resolveBrandDir,
} from "./lib/brand-loader.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const WIDTH = 1080;
const HEIGHT = 1080;

const brandDir = resolveBrandDir(ROOT);
const brand = loadBrand(brandDir);

function buildHTML() {
  const primary = brand.colors.primary_dark || "#1a1a2e";
  const accent = brand.colors.accent_orange || "#e94560";
  const light = brand.colors.light || "#f5f5f5";

  return `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    background: ${primary};
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px;
  }

  .brand-name {
    font-weight: 900;
    font-size: 64px;
    color: ${light};
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 24px;
  }

  .tagline {
    font-weight: 400;
    font-size: 32px;
    color: ${accent};
    margin-bottom: 60px;
  }

  .card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    padding: 48px;
    width: 100%;
  }

  .card-title {
    font-weight: 700;
    font-size: 28px;
    color: ${light};
    margin-bottom: 16px;
  }

  .card-body {
    font-weight: 400;
    font-size: 20px;
    color: rgba(245,245,245,0.7);
    line-height: 1.5;
  }

  .accent-bar {
    width: 60px;
    height: 4px;
    background: ${accent};
    border-radius: 2px;
    margin: 0 auto 24px;
  }

  .footer {
    margin-top: 48px;
    font-size: 18px;
    color: rgba(245,245,245,0.4);
    letter-spacing: 1px;
  }
</style>
</head>
<body>
  <div class="brand-name">${brand.name}</div>
  <div class="tagline">Train smarter, not harder.</div>
  <div class="card">
    <div class="accent-bar"></div>
    <div class="card-title">This is an example post</div>
    <div class="card-body">
      Generated with pixelagent.<br>
      Colors, fonts, and layout are pulled<br>
      from your brand.md config.
    </div>
  </div>
  <div class="footer">pixelagent</div>
</body>
</html>`;
}

async function main() {
  const outputDir = path.join(brandDir, "output", "example");
  ensureDir(outputDir);

  console.log(`Generating example post (${WIDTH}x${HEIGHT}) for ${brand.name}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  await page.setContent(buildHTML(), { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));

  const outputPath = path.join(outputDir, "example-post.jpg");
  await page.screenshot({
    path: outputPath,
    type: "jpeg",
    quality: 95,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });

  await page.close();
  await browser.close();
  console.log(`Done! Saved to: ${outputPath}`);
}

main().catch(console.error);
