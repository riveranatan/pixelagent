import fs from "fs";
import path from "path";

/**
 * Parses a brand.md file into a structured config object.
 * Extracts name, colors, fonts, logos, tone, locales, and marketing copy.
 */
export function loadBrand(brandDir) {
  const brandFile = path.join(brandDir, "brand.md");
  if (!fs.existsSync(brandFile)) {
    throw new Error(`brand.md not found in ${brandDir}`);
  }

  const content = fs.readFileSync(brandFile, "utf-8");
  const brand = {
    name: "",
    assetsDir: path.join(brandDir, "assets"),
    outputDir: path.join(brandDir, "output"),
    colors: {},
    fonts: { dir: path.join(brandDir, "assets", "fonts"), files: {}, family: "" },
    logos: [],
    tone: "",
    locales: [],
    copy: {},
    raw: content,
  };

  // Extract brand name from first H1
  const nameMatch = content.match(/^#\s+(.+)$/m);
  if (nameMatch) brand.name = nameMatch[1].trim();

  // Extract colors from any table with hex values
  const colorTableRegex =
    /\|\s*([^|]+)\s*\|\s*(#[0-9a-fA-F]{6})\s*\|\s*([^|]+)\s*\|/g;
  let colorMatch;
  while ((colorMatch = colorTableRegex.exec(content))) {
    const name = colorMatch[1].trim().toLowerCase().replace(/\s+/g, "_");
    brand.colors[name] = colorMatch[2].trim();
  }

  // Extract primary font family name
  const fontFamilyMatch = content.match(/###\s+Primary Font:\s*(.+)/);
  if (fontFamilyMatch) brand.fonts.family = fontFamilyMatch[1].trim();

  // Extract font file references from backtick paths
  const fontFileRegex = /`assets\/fonts\/([^`]+)`/g;
  let fontFileMatch;
  while ((fontFileMatch = fontFileRegex.exec(content))) {
    const filename = fontFileMatch[1];
    // Derive weight key from filename: "Inter-Bold.ttf" → "bold"
    const weightMatch = filename.match(/[-_](Regular|Bold|Black|Light|Medium|Thin|UltraBlack|ExtraBold|SemiBold)/i);
    const key = weightMatch ? weightMatch[1].toLowerCase() : "regular";
    brand.fonts.files[key] = filename;
  }

  // Extract logo variants from Logo table
  const logoTableRegex = /\|\s*([^|]+)\s*\|\s*`([^`]+)`\s*\|\s*([^|]+)\s*\|/g;
  let logoMatch;
  const logoSection = content.slice(content.indexOf("## Logo"));
  const logoEnd = logoSection.indexOf("\n## ", 4);
  const logoContent = logoEnd > 0 ? logoSection.slice(0, logoEnd) : logoSection;
  while ((logoMatch = logoTableRegex.exec(logoContent))) {
    brand.logos.push({
      variant: logoMatch[1].trim(),
      file: logoMatch[2].trim(),
      usage: logoMatch[3].trim(),
    });
  }

  // Extract tone of voice
  const toneMatch = content.match(/##\s+Tone of Voice\n([\s\S]*?)(?=\n##|\n$)/);
  if (toneMatch) brand.tone = toneMatch[1].trim();

  // Extract locales
  const localeSection = content.match(/##\s+Locales\n([\s\S]*?)(?=\n##|\n$)/);
  if (localeSection) {
    const localeLines = localeSection[1].split("\n").filter((l) => l.startsWith("- "));
    brand.locales = localeLines.map((l) => {
      const m = l.match(/\((\w+)\)/);
      return m ? m[1] : l.replace("- ", "").trim();
    });
  }

  // Extract marketing copy tables per locale
  const copyRegex = /###\s+(English|Spanish|French|German|Portuguese|Italian|Japanese|Korean|Chinese)\n([\s\S]*?)(?=\n###|\n##|\n$)/g;
  let copyMatch;
  while ((copyMatch = copyRegex.exec(content))) {
    const locale = langToCode(copyMatch[1]);
    const tableContent = copyMatch[2];
    const rows = [];
    const rowRegex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableContent))) {
      const screen = rowMatch[1].trim();
      if (screen === "Screen" || screen.startsWith("--")) continue;
      rows.push({
        screen,
        headline: rowMatch[2].trim(),
        subtext: rowMatch[3].trim(),
      });
    }
    if (rows.length) brand.copy[locale] = rows;
  }

  return brand;
}

function langToCode(lang) {
  const map = {
    english: "en", spanish: "es", french: "fr", german: "de",
    portuguese: "pt", italian: "it", japanese: "ja", korean: "ko", chinese: "zh",
  };
  return map[lang.toLowerCase()] || lang.toLowerCase().slice(0, 2);
}

/**
 * Load font files as base64 data URIs for embedding in HTML.
 * @param {string} fontsDir - Directory containing font files
 * @param {Object} fontFiles - Map of weight names to filenames, e.g. { regular: "Inter-Regular.ttf" }
 */
export function loadFonts(fontsDir, fontFiles) {
  const fonts = {};
  for (const [key, filename] of Object.entries(fontFiles)) {
    const filePath = path.join(fontsDir, filename);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      const format = ext === ".otf" ? "opentype" : "truetype";
      fonts[key] = `data:font/${format};base64,${buf.toString("base64")}`;
    }
  }
  return fonts;
}

/**
 * Auto-load all font files from a directory.
 * Derives weight keys from filenames.
 */
export function loadAllFonts(fontsDir) {
  if (!fs.existsSync(fontsDir)) return {};
  const files = fs.readdirSync(fontsDir).filter((f) => /\.(ttf|otf|woff2?)$/i.test(f));
  const fontFiles = {};
  for (const file of files) {
    const weightMatch = file.match(/[-_](Regular|Bold|Black|Light|Medium|Thin|UltraBlack|ExtraBold|SemiBold)/i);
    const key = weightMatch ? weightMatch[1].toLowerCase() : path.basename(file, path.extname(file)).toLowerCase();
    fontFiles[key] = file;
  }
  return loadFonts(fontsDir, fontFiles);
}

/**
 * Load an image file as a base64 data URI.
 */
export function imageToDataURI(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".svg"
        ? "image/svg+xml"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/**
 * Load all images from a directory as a map of filename → data URI.
 */
export function loadImages(dir) {
  if (!fs.existsSync(dir)) return {};
  const images = {};
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f));
  for (const file of files) {
    const key = path.basename(file, path.extname(file)).toLowerCase().replace(/\s+/g, "_");
    images[key] = imageToDataURI(path.join(dir, file));
  }
  return images;
}

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Resolve the brand directory from a --brand CLI argument.
 */
export function resolveBrandDir(rootDir) {
  const brandArg = process.argv.find((a) => a.startsWith("--brand="));
  const brandName = brandArg
    ? brandArg.split("=")[1]
    : process.argv[process.argv.indexOf("--brand") + 1];

  if (!brandName) {
    console.error("Usage: node <script> --brand <brand-name>");
    process.exit(1);
  }

  const brandDir = path.join(rootDir, "brand", brandName);
  if (!fs.existsSync(brandDir)) {
    console.error(`Brand directory not found: ${brandDir}`);
    process.exit(1);
  }

  return brandDir;
}
