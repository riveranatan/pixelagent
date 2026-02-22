Generate a marketing asset for a brand.

## Instructions

1. Parse $ARGUMENTS for the brand name and asset type. If not clear, ask the user:
   - Which brand? (list available brands from `brand/` directory)
   - What type of asset? (e.g., iOS screenshots, Instagram carousel, story, banner, feature graphic)

2. Read `brand/<brand-name>/brand.md` to understand the brand

3. Check what assets are available in `brand/<brand-name>/assets/` (fonts, logos, images)

4. Read `reference/social-media-best-practices.md` for platform-specific guidelines

5. Write a Puppeteer generation script in `scripts/` following these conventions:
   - Name it `generate-<asset-type>.mjs`
   - Use `scripts/lib/brand-loader.mjs` for loading brand config, fonts, and images
   - Use `scripts/lib/components.mjs` for phone mockups, font-face CSS, and other shared components
   - Accept `--brand <name>` flag
   - Embed all fonts and images as base64 data URIs
   - Output to `brand/<brand-name>/output/<asset-type>/`

6. Run the script and verify it completes successfully

7. Tell the user where the output files are
