import fs from "fs";
import path from "path";

/**
 * Parses a brand.md file into a structured config object.
 * Extracts colors, fonts, typography settings, and marketing copy.
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
    fonts: {},
    locales: [],
  };

  // Extract brand name from first H1
  const nameMatch = content.match(/^#\s+(.+)$/m);
  if (nameMatch) brand.name = nameMatch[1].trim();

  // Extract colors from the Colors table
  const colorTableRegex =
    /\|\s*([^|]+)\s*\|\s*(#[0-9a-fA-F]{6})\s*\|\s*([^|]+)\s*\|/g;
  let colorMatch;
  while ((colorMatch = colorTableRegex.exec(content))) {
    const name = colorMatch[1].trim().toLowerCase().replace(/\s+/g, "_");
    brand.colors[name] = colorMatch[2].trim();
  }

  // Extract font directory
  brand.fonts.dir = path.join(brand.assetsDir, "fonts");

  // Extract locales
  const localeMatch = content.match(
    /##\s+Locales\n(?:- (\w+)[^\n]*\n?)+/
  );
  if (localeMatch) {
    const localeLines = content
      .slice(content.indexOf("## Locales"))
      .split("\n")
      .filter((l) => l.startsWith("- "));
    brand.locales = localeLines.map((l) => {
      const m = l.match(/\((\w+)\)/);
      return m ? m[1] : l.replace("- ", "").trim();
    });
  }

  return brand;
}

/**
 * Load font files as base64 data URIs for embedding in HTML.
 */
export function loadFonts(fontsDir, fontFiles) {
  const fonts = {};
  for (const [key, filename] of Object.entries(fontFiles)) {
    const filePath = path.join(fontsDir, filename);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      fonts[key] = `data:font/truetype;base64,${buf.toString("base64")}`;
    }
  }
  return fonts;
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
        : "image/jpeg";
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
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
