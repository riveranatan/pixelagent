Import brand guidelines from a PDF into a structured brand.md file.

## Instructions

1. Ask the user for the brand name if not provided as $ARGUMENTS
2. Run `node scripts/init-brand.mjs <brand-name>` to scaffold the brand directory (skip if it already exists)
3. Look for PDF files in `brand/<brand-name>/assets/` — if none found, ask the user to drop one there
4. Read the PDF brand guidelines document
5. Extract and write `brand/<brand-name>/brand.md` with:
   - Brand name, tagline, description, website
   - Complete color palette (Name, Hex, Usage) in a markdown table
   - Typography: font names, weights, hierarchy, sizes
   - Logo variants and usage rules in a markdown table
   - Tone of voice
   - Locales
   - Any marketing copy, slogans, or messaging guidelines
   - Do's and don'ts for brand usage
6. Identify fonts:
   - If they're Google Fonts, download them: `node scripts/lib/download-font.mjs --brand <brand-name> --font "FontName"`
   - If commercial/custom, list them in brand.md and tell the user to add the .ttf/.otf files to `brand/<brand-name>/assets/fonts/`
7. Ask the user to provide logo files as PNG/SVG in `brand/<brand-name>/assets/logos/`
8. Show a summary of what was extracted and flag anything that was ambiguous or missing from the PDF
