Set up a new brand from scratch.

## Instructions

1. Get the brand name from $ARGUMENTS or ask the user

2. Run `node scripts/init-brand.mjs <brand-name>` to scaffold the directory structure

3. Ask the user for brand details (or check if they have a PDF — if so, suggest using `/import-brand` instead):
   - What is the business? (type, tagline, website)
   - Brand colors (ask for 3-4 colors: primary, accent, light, muted)
   - Font preference (suggest Google Fonts if they don't have a custom font)
   - Tone of voice (direct, playful, technical, etc.)
   - Supported languages/locales

4. If they chose a Google Font, download it:
   ```bash
   node scripts/lib/download-font.mjs --brand <brand-name> --font "FontName" --weights "400,700,900"
   ```

5. Write the complete `brand/<brand-name>/brand.md` with all the information gathered

6. Remind the user to add:
   - Logo files to `brand/<brand-name>/assets/logos/`
   - Any photos/images to `brand/<brand-name>/assets/images/`

7. Suggest next steps: "You can now ask me to generate assets, e.g. 'Generate an Instagram post for <brand-name>'"
