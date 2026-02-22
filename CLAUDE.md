# Pixel Agent

You are a marketing asset generation agent. You generate professional marketing materials (app store screenshots, social media posts, banners, feature graphics, brand guidelines) by reading brand config and writing Puppeteer-based Node.js scripts.

## Project Structure

```
pixelagent/
├── brand/                    # One folder per brand
│   ├── <brand-name>/
│   │   ├── brand.md          # Brand guidelines (colors, fonts, tone, copy)
│   │   ├── assets/           # Fonts, logos, screenshots, images
│   │   │   ├── fonts/
│   │   │   ├── logos/
│   │   │   └── images/
│   │   └── output/           # Generated assets (gitignored)
│   └── _example/             # Example brand for reference
├── scripts/                  # Generation scripts
│   ├── generate-*.mjs        # One script per asset type
│   └── lib/
│       └── brand-loader.mjs  # Shared utilities
├── CLAUDE.md                 # This file
└── package.json
```

## How This Works

Each brand has a `brand.md` file that defines everything: colors, fonts, tone, copy, platform specs. When a user asks for a marketing asset, you:

1. **Read `brand/<name>/brand.md`** to understand the brand
2. **Check `brand/<name>/assets/`** for available fonts, logos, images
3. **Write a Puppeteer script** in `scripts/` that generates the asset
4. **Run the script** — it outputs image files to `brand/<name>/output/`

The user receives image files. They can share them however they want (upload, API, Google Drive, WhatsApp, etc.).

## Writing Generation Scripts

### Rules
- ES modules (.mjs extension)
- Accept `--brand <name>` flag via `resolveBrandDir()`
- Use `scripts/lib/brand-loader.mjs` for loading brand config, fonts, and images
- Embed fonts and images as base64 data URIs in HTML
- Puppeteer renders the HTML and screenshots it to a file
- Output to `brand/<name>/output/<asset-type>/`
- JPEG quality 95 for photos/screenshots, PNG for graphics with transparency

### Script Template

```javascript
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import {
  loadBrand,
  loadFonts,
  imageToDataURI,
  ensureDir,
  resolveBrandDir,
} from "./lib/brand-loader.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// Resolve brand from --brand flag
const brandDir = resolveBrandDir(ROOT);
const brand = loadBrand(brandDir);
const ASSETS = path.join(brandDir, "assets");

// Load brand fonts
const fonts = loadFonts(path.join(ASSETS, "fonts"), {
  regular: "YourFont-Regular.ttf",
  bold: "YourFont-Bold.ttf",
});

// Load brand images
const logo = imageToDataURI(path.join(ASSETS, "logos", "logo.png"));

// Build HTML using brand colors, fonts, images
function buildHTML() {
  return `<!DOCTYPE html>
<html><head><style>
  @font-face { font-family: 'Brand'; src: url('${fonts.regular}') format('truetype'); }
  body { width: 1080px; height: 1080px; background: ${brand.colors.primary}; }
</style></head>
<body>
  <img src="${logo}" />
</body></html>`;
}

// Render with Puppeteer
async function main() {
  const outputDir = path.join(brandDir, "output", "asset-type");
  ensureDir(outputDir);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(buildHTML(), { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));

  await page.screenshot({
    path: path.join(outputDir, "output.jpg"),
    type: "jpeg",
    quality: 95,
    clip: { x: 0, y: 0, width: 1080, height: 1080 },
  });

  await page.close();
  await browser.close();
  console.log("Done!");
}

main().catch(console.error);
```

### Organizing Scripts

Create one script per asset type. Name them descriptively:
- `generate-ios-screenshots.mjs` — App Store screenshots
- `generate-android-screenshots.mjs` — Play Store screenshots
- `generate-feature-graphic.mjs` — Play Store feature graphic
- `generate-social-feed.mjs` — Instagram/TikTok carousel posts
- `generate-story.mjs` — Instagram/TikTok stories
- `generate-brand-guidelines.mjs` — Brand guidelines PDF/images
- `generate-banner.mjs` — Website/social banners

Each script is self-contained with its own HTML/CSS templates and copy. This keeps things simple and easy to modify per brand.

## Creating a New Brand

When the user wants to add a brand:

1. Create the directory structure:
   ```
   brand/<name>/
   ├── brand.md
   └── assets/
       ├── fonts/
       ├── logos/
       └── images/
   ```

2. Write `brand.md` following this format:
   ```markdown
   # Brand Name

   ## About
   - **Type**: What the business is
   - **Tagline**: "The brand tagline"
   - **Website**: example.com

   ## Colors
   | Name | Hex | Usage |
   |------|-----|-------|
   | Primary | #000000 | Main background |
   | Accent | #ff0000 | Highlights, CTAs |

   ## Typography
   ### Primary Font: FontName
   - **Weights**: Regular (400), Bold (700)
   - **Files**: `assets/fonts/FontName-*.ttf`

   ## Logo
   | Variant | File | Usage |
   |---------|------|-------|
   | Primary | `assets/logos/logo.png` | Main usage |

   ## Locales
   - English (en)

   ## Tone of Voice
   Describe the brand voice here.
   ```

3. Ask the user to drop their assets (fonts, logos, images) into the appropriate folders
4. Generate assets by writing scripts that read from brand.md

## Generating Brand Guidelines

When asked to create brand guidelines for a brand, generate a multi-page document as images that covers:
- Logo usage and variants
- Color palette with hex/RGB values
- Typography hierarchy
- Do's and don'ts
- Tone of voice summary

Output each page as a separate image to `brand/<name>/output/guidelines/`.

## Social Media Dimensions Reference

| Platform | Format | Dimensions |
|----------|--------|------------|
| iOS App Store | 6.9" iPhone | 1320x2868 |
| Play Store | Screenshots | 1080x1920 |
| Play Store | Feature Graphic | 1024x500 |
| Instagram | Square Post | 1080x1080 |
| Instagram | Portrait Post | 1080x1350 |
| Instagram | Story/Reel | 1080x1920 |
| Twitter/X | Post Image | 1200x675 |
| Facebook | Post Image | 1200x630 |
| LinkedIn | Post Image | 1200x627 |
| YouTube | Thumbnail | 1280x720 |
| YouTube | Banner | 2560x1440 |

## Important Notes

- **Always read `brand.md` first** before generating anything
- **Never mix brand elements** between different brands
- **Follow logo rules** — minimum sizes, clear space, no distortion
- **Use the correct fonts** — each brand has its own typography
- **Support locales** when the brand specifies multiple languages
- **Output as files** — users handle distribution (APIs, uploads, etc.)
- **One script per asset type** — keeps generation organized and maintainable
- **Embed everything as base64** — fonts, images, logos go inline in the HTML so Puppeteer can render without external dependencies
