#!/usr/bin/env node

/**
 * Scaffolds a new brand directory with the required structure and a starter brand.md.
 *
 * Usage: node scripts/init-brand.mjs <brand-name>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const brandName = process.argv[2];

if (!brandName) {
  console.error("Usage: node scripts/init-brand.mjs <brand-name>");
  console.error("Example: node scripts/init-brand.mjs mybrand");
  process.exit(1);
}

if (brandName.startsWith("_")) {
  console.error("Brand names cannot start with underscore (reserved for internal use).");
  process.exit(1);
}

const brandDir = path.join(ROOT, "brand", brandName);

if (fs.existsSync(brandDir)) {
  console.error(`Brand "${brandName}" already exists at: ${brandDir}`);
  process.exit(1);
}

// Create directory structure
const dirs = [
  path.join(brandDir, "assets", "fonts"),
  path.join(brandDir, "assets", "logos"),
  path.join(brandDir, "assets", "images"),
  path.join(brandDir, "output"),
];

for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write starter brand.md
const brandMd = `# ${brandName.charAt(0).toUpperCase() + brandName.slice(1)}

## About
- **Type**: <!-- What is this business? App, studio, agency, etc. -->
- **Tagline**: "<!-- Your tagline -->"
- **Website**: <!-- yoursite.com -->

## Brand Concept
<!-- What does the brand stand for? 2-3 sentences. -->

## Target Audience
<!-- Who is this for? -->

## Tone of Voice
<!-- How should copy sound? Direct, playful, technical, warm, etc. -->

## Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #000000 | Main background |
| Accent | #ff0000 | Highlights, CTAs, accent elements |
| Light | #ffffff | Text on dark backgrounds |
| Muted | #888888 | Secondary text, subtle elements |

## Typography

### Primary Font: <!-- Font Name -->
- **Weights**: Regular (400), Bold (700)
- **Files**: \`assets/fonts/FontName-Regular.ttf\`, \`assets/fonts/FontName-Bold.ttf\`

### Hierarchy
| Element | Weight | Size | Style |
|---------|--------|------|-------|
| Headline | Bold (700) | 72px | Uppercase |
| Subtext | Regular (400) | 28px | Normal |
| Body | Regular (400) | 18px | Normal |

## Logo

| Variant | File | Usage |
|---------|------|-------|
| Primary | \`assets/logos/logo.png\` | Main usage |

### Logo rules
- Minimum width: 120px
- Do NOT: distort, rotate, add effects, modify colors

## Locales
- English (en)

## Marketing Copy

### English
| Screen | Headline | Subtext |
|--------|----------|---------|
| <!-- screen name --> | <!-- Headline --> | <!-- Subtext --> |
`;

fs.writeFileSync(path.join(brandDir, "brand.md"), brandMd);

console.log(`Brand "${brandName}" created at: ${brandDir}`);
console.log("");
console.log("Next steps:");
console.log(`  1. Edit brand/${brandName}/brand.md with your brand details`);
console.log(`  2. Drop your fonts into brand/${brandName}/assets/fonts/`);
console.log(`  3. Drop your logos into brand/${brandName}/assets/logos/`);
console.log(`  4. Drop any images into brand/${brandName}/assets/images/`);
console.log(`  5. Ask Claude Code to generate assets for "${brandName}"`);
