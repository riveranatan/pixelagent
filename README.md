# pixelagent

CLI tool for generating marketing assets from brand config. Puppeteer-based, multi-brand, multi-locale. No design tools needed.

## How it works

1. You define your brand — either write a `brand.md` from scratch or **drop a PDF brand guidelines file** and let Claude Code extract everything for you
2. You drop your assets (fonts, logos, images) into the brand folder — or let Claude download Google Fonts automatically
3. You ask Claude Code to generate what you need — it writes a Puppeteer script that renders HTML/CSS to pixel-perfect images
4. You get image files. Share them however you want.

Claude Code orchestrates everything: reads your brand config, writes the generation script, runs it, and outputs the files. One script per asset type keeps things organized and easy to tweak.

## What it generates

- App Store screenshots (iOS & Android)
- Play Store feature graphics
- Social media posts (Instagram, Twitter/X, Facebook, LinkedIn)
- Stories and reels
- Brand guidelines documents
- Banners and promotional graphics
- Whatever you need — just ask

## Setup

```bash
git clone https://github.com/riveranatan/pixelagent.git
cd pixelagent
npm install
```

Requires Node.js 18+ and [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Quick start

### 1. Create your brand

```bash
node scripts/init-brand.mjs mybrand
```

This scaffolds the directory structure and a starter `brand.md`:

```
brand/mybrand/
├── brand.md              # Brand config (edit this)
└── assets/
    ├── fonts/            # .ttf or .otf files
    ├── logos/            # Logo variants (.png, .svg)
    └── images/           # Photos, backgrounds, screenshots
```

### 2. Define your brand

**Have a PDF brand guide?** This is the fastest path. Drop it into your brand folder and let Claude Code do the rest:

```bash
# Drop your PDF into the brand folder
cp ~/Downloads/my-brand-guidelines.pdf brand/mybrand/assets/
```

Then open Claude Code and say:

```
"Read the brand guidelines PDF in brand/mybrand/assets/ and create brand.md from it"
```

Claude Code reads the PDF directly, understands the design specs, and generates a complete `brand.md` with:
- Color palette (hex values, names, usage)
- Typography (font names, weights, hierarchy)
- Logo usage rules
- Tone of voice
- Any other brand standards it finds

If something is ambiguous in the PDF, Claude will ask you rather than guess.

**No PDF? Starting from scratch?** Edit `brand.md` directly:

```markdown
# My Brand

## About
- **Type**: What your business is
- **Tagline**: "Your tagline here"
- **Website**: yourbrand.com

## Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | #000000 | Main background |
| Accent | #ff0000 | Highlights, CTAs |
| Light | #ffffff | Text on dark |

## Typography
### Primary Font: YourFont
- **Weights**: Regular (400), Bold (700)
- **Files**: `assets/fonts/YourFont-Regular.ttf`

## Logo
| Variant | File | Usage |
|---------|------|-------|
| Primary | `assets/logos/logo.png` | Main usage |

## Tone of Voice
Direct, professional, etc.

## Locales
- English (en)
- Spanish (es)
```

See [brand/_example/brand.md](brand/_example/brand.md) for a full example.

### 3. Download fonts

For Google Fonts, download directly into your brand:

```bash
node scripts/lib/download-font.mjs --brand mybrand --font "Inter"
node scripts/lib/download-font.mjs --brand mybrand --font "Montserrat" --weights "400,700,900"
```

For custom/commercial fonts, drop the `.ttf` or `.otf` files into `brand/mybrand/assets/fonts/`.

### 4. Generate assets

Open Claude Code in the project root and ask:

```
"Generate iOS App Store screenshots for mybrand"
"Create an Instagram carousel post for mybrand promoting our new feature"
"Make a Play Store feature graphic for mybrand"
"Generate brand guidelines for mybrand"
```

Claude will:
1. Read your `brand.md`
2. Check your available assets
3. Write a script in `scripts/`
4. Run it
5. Output images to `brand/mybrand/output/`

### 5. Run existing scripts

Once a script exists, run it directly:

```bash
node scripts/generate-ios-screenshots.mjs --brand mybrand
node scripts/generate-social-feed.mjs --brand mybrand --locale en
```

## Project structure

```
pixelagent/
├── brand/                    # One folder per brand
│   ├── mybrand/
│   │   ├── brand.md          # Brand config
│   │   ├── assets/           # Fonts, logos, images
│   │   └── output/           # Generated images (gitignored)
│   └── _example/             # Reference brand
├── scripts/                  # Generation scripts
│   ├── generate-*.mjs        # One per asset type
│   ├── init-brand.mjs        # Scaffold a new brand
│   └── lib/
│       ├── brand-loader.mjs  # Brand config parser & asset loaders
│       ├── components.mjs    # Reusable phone mockups, layouts, etc.
│       └── download-font.mjs # Google Fonts downloader
├── reference/                # Best practices for asset generation
│   └── social-media-best-practices.md
├── .claude/commands/          # Slash commands (/import-brand, /generate, /new-brand)
├── CLAUDE.md                 # Agent instructions
└── package.json
```

## Slash commands

pixelagent ships with Claude Code slash commands:

| Command | What it does |
|---------|-------------|
| `/import-brand` | Read a PDF brand guidelines file and extract everything into `brand.md` |
| `/new-brand` | Set up a new brand interactively — colors, fonts, tone |
| `/generate` | Generate a marketing asset for a brand |

```
> /import-brand acme
> /new-brand mybrand
> /generate mybrand instagram carousel
```

## Claude Code is the engine

pixelagent isn't a traditional CLI — Claude Code is the orchestrator. The repo provides structure (brand config, shared utilities, best practices) and Claude does the thinking:

- **PDF → brand.md**: Drop a brand guidelines PDF and Claude extracts everything into a structured config file
- **Script generation**: Describe what you want and Claude writes the Puppeteer script using your brand's colors, fonts, and assets
- **Font sourcing**: Claude identifies fonts from your brand guide and downloads them from Google Fonts, or asks you to provide commercial fonts
- **Best practices**: Claude references `reference/social-media-best-practices.md` for platform-specific sizing, typography rules, and layout patterns

You talk to Claude in natural language. The scripts and config are just how it organizes its work.

## How scripts work

Each script is a self-contained Node.js file that:

1. Reads brand config via `brand-loader.mjs`
2. Loads fonts and images as base64 data URIs
3. Builds an HTML/CSS template with the brand's colors, typography, and assets
4. Launches headless Chromium via Puppeteer
5. Screenshots the rendered page to a file

Everything is embedded inline (base64 fonts, base64 images) so Puppeteer renders with zero external dependencies.

## Shared components

`scripts/lib/components.mjs` provides reusable building blocks:

- **iPhone mockup** — realistic iPhone 16 Pro Max frame with Dynamic Island
- **Android mockup** — Pixel-style frame with punch-hole camera
- **Font-face generator** — auto-generate `@font-face` CSS from loaded fonts
- **Carousel dots** — slide indicator component
- **Base CSS** — reset + canvas sizing

## Adding scripts to package.json

```json
{
  "scripts": {
    "mybrand:ios": "node scripts/generate-ios-screenshots.mjs --brand mybrand",
    "mybrand:android": "node scripts/generate-android-screenshots.mjs --brand mybrand",
    "mybrand:social": "node scripts/generate-social-feed.mjs --brand mybrand"
  }
}
```

## Dimensions reference

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

## Integrations

pixelagent outputs image files to disk. You're free to connect whatever you want downstream:

- Upload to Google Drive, Dropbox, S3
- Send via WhatsApp, Slack, email
- Push to a CMS or social media scheduler
- Pipe into a CI/CD pipeline

The tool stays focused on generation. Distribution is up to you.

## Roadmap

- **Image generation API** — plug in DALL-E, Flux, or other image gen APIs to create custom visuals, backgrounds, and illustrations directly from brand prompts
- **Video generation** — [Remotion](https://remotion.dev) integration for animated social posts, reels, and promo videos rendered from the same brand config

## License

MIT
