# pixelagent

CLI tool for generating marketing assets from brand config. Puppeteer-based, multi-brand, multi-locale. No design tools needed.

## How it works

1. You define your brand in a `brand.md` file (colors, fonts, tone, copy)
2. You drop your assets (fonts, logos, images) into the brand folder
3. You ask Claude Code to generate what you need — it writes a Puppeteer script that renders HTML/CSS to pixel-perfect images
4. You get image files. Share them however you want.

Claude Code reads your brand config, writes the generation script, runs it, and outputs the files. One script per asset type keeps things organized and easy to tweak.

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
git clone https://github.com/YOUR_USERNAME/pixelagent.git
cd pixelagent
npm install
```

Requires Node.js 18+ and [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Quick start

### 1. Create your brand

```
brand/mybrand/
├── brand.md              # Brand config (see below)
└── assets/
    ├── fonts/            # .ttf or .otf files
    ├── logos/            # Logo variants (.png, .svg)
    └── images/           # Photos, backgrounds, screenshots
```

### 2. Write your brand.md

This is the single source of truth for your brand. Claude reads it before generating anything.

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

### 3. Generate assets

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

### 4. Run existing scripts

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
│   └── lib/
│       └── brand-loader.mjs  # Shared utilities
├── CLAUDE.md                 # Agent instructions
└── package.json
```

## How scripts work

Each script is a self-contained Node.js file that:

1. Reads brand config via `brand-loader.mjs`
2. Loads fonts and images as base64 data URIs
3. Builds an HTML/CSS template with the brand's colors, typography, and assets
4. Launches headless Chromium via Puppeteer
5. Screenshots the rendered page to a file

Everything is embedded inline (base64 fonts, base64 images) so Puppeteer renders with zero external dependencies.

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

## License

MIT
