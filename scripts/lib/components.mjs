/**
 * Shared HTML/CSS components for marketing asset generation.
 * Use these in your generation scripts to keep layouts consistent.
 */

/**
 * iPhone mockup CSS. Use with the iphoneHTML() function.
 * Renders a realistic iPhone 16 Pro Max frame with Dynamic Island.
 */
export function iphoneCSS(opts = {}) {
  const width = opts.width || "auto";
  const height = opts.height || "100%";
  const borderRadius = opts.borderRadius || 68;

  return `
  .iphone {
    position: relative; width: ${width}; height: ${height}; aspect-ratio: 1344 / 2796;
    border-radius: ${borderRadius}px;
    background: linear-gradient(160deg, #3a3a3e 0%, #222224 20%, #1a1a1c 50%, #28282a 80%, #333335 100%);
    box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 15px 40px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.05),
      inset 1px 0 0 rgba(255,255,255,0.10), inset -1px 0 0 rgba(255,255,255,0.10);
    flex-shrink: 0;
  }
  .iphone::before {
    content: ''; position: absolute; inset: -3px; border-radius: ${borderRadius + 3}px;
    background: linear-gradient(160deg, rgba(200,200,205,0.35) 0%, rgba(120,120,125,0.15) 25%,
      rgba(80,80,85,0.2) 50%, rgba(140,140,145,0.15) 75%, rgba(200,200,205,0.25) 100%);
    z-index: -1;
  }
  .iphone .btn-power { position: absolute; right: -5px; top: 26%; width: 5px; height: 90px; background: linear-gradient(90deg, #444, #2a2a2c, #444); border-radius: 0 3px 3px 0; }
  .iphone .btn-vol-up { position: absolute; left: -5px; top: 22%; width: 5px; height: 55px; background: linear-gradient(270deg, #444, #2a2a2c, #444); border-radius: 3px 0 0 3px; }
  .iphone .btn-vol-down { position: absolute; left: -5px; top: 30%; width: 5px; height: 55px; background: linear-gradient(270deg, #444, #2a2a2c, #444); border-radius: 3px 0 0 3px; }
  .iphone .btn-action { position: absolute; left: -5px; top: 17%; width: 5px; height: 38px; background: linear-gradient(270deg, #444, #2a2a2c, #444); border-radius: 3px 0 0 3px; }
  .iphone .screen {
    position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px;
    border-radius: ${borderRadius - 13}px; overflow: hidden; background: #000;
  }
  .iphone .screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .iphone .dynamic-island {
    position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 36px; background: #000; border-radius: 18px; z-index: 10;
    box-shadow: 0 0 0 1px rgba(50,50,50,0.3);
  }
  .iphone .screen::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.015) 100%);
    pointer-events: none; border-radius: ${borderRadius - 13}px; z-index: 5;
  }`;
}

export function iphoneHTML(screenshotDataURI) {
  return `<div class="iphone">
    <div class="btn-power"></div>
    <div class="btn-action"></div>
    <div class="btn-vol-up"></div>
    <div class="btn-vol-down"></div>
    <div class="screen">
      <div class="dynamic-island"></div>
      <img src="${screenshotDataURI}" />
    </div>
  </div>`;
}

/**
 * Android phone mockup CSS. Pixel-style with punch-hole camera.
 */
export function androidCSS(opts = {}) {
  const width = opts.width || "340px";
  const height = opts.height || "720px";
  const borderRadius = opts.borderRadius || 36;

  return `
  .android-phone {
    position: relative; width: ${width}; height: ${height};
    border-radius: ${borderRadius}px;
    background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1c 30%, #111113 60%, #1e1e20 90%, #2a2a2e 100%);
    box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 12px 30px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04),
      inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .android-phone::before {
    content: ''; position: absolute; inset: -2px; border-radius: ${borderRadius + 2}px;
    background: linear-gradient(160deg, rgba(180,180,185,0.25) 0%, rgba(100,100,105,0.10) 25%,
      rgba(70,70,75,0.15) 50%, rgba(120,120,125,0.10) 75%, rgba(180,180,185,0.18) 100%);
    z-index: -1;
  }
  .android-phone .screen {
    position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px;
    border-radius: ${borderRadius - 6}px; overflow: hidden; background: #000;
  }
  .android-phone .screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
  .android-phone .screen::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.01) 100%);
    pointer-events: none; border-radius: ${borderRadius - 6}px; z-index: 5;
  }
  .android-phone .punch-hole {
    position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
    width: 12px; height: 12px; background: #000; border-radius: 50%; z-index: 10;
    box-shadow: 0 0 0 2px rgba(40,40,40,0.5);
  }`;
}

export function androidHTML(screenshotDataURI) {
  return `<div class="android-phone">
    <div class="screen">
      <div class="punch-hole"></div>
      <img src="${screenshotDataURI}" />
    </div>
  </div>`;
}

/**
 * Font-face CSS generator from loaded fonts map.
 * @param {string} family - CSS font-family name
 * @param {Object} fonts - Map of weight keys to base64 data URIs from loadFonts()
 */
export function fontFaceCSS(family, fonts) {
  const weightMap = {
    thin: 100, extralight: 200, light: 300, regular: 400,
    medium: 500, semibold: 600, bold: 700, extrabold: 800,
    black: 900, ultrablack: 950,
  };

  return Object.entries(fonts)
    .map(([key, dataURI]) => {
      const weight = weightMap[key] || 400;
      const format = dataURI.includes("opentype") ? "opentype" : "truetype";
      return `@font-face { font-family: '${family}'; src: url('${dataURI}') format('${format}'); font-weight: ${weight}; }`;
    })
    .join("\n  ");
}

/**
 * Base CSS reset and body setup for a given canvas size.
 */
export function baseCSS(width, height) {
  return `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${width}px; height: ${height}px; overflow: hidden;
    position: relative;
  }`;
}

/**
 * Carousel slide indicator dots.
 * @param {number} total - Total number of slides
 * @param {number} active - Active slide index (0-based)
 * @param {string} accentColor - Color for the active dot
 */
export function slideDotsCSS(accentColor = "#ffffff") {
  return `
  .slide-dots { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); }
  .dot.active { background: ${accentColor}; width: 24px; border-radius: 4px; }`;
}

export function slideDotsHTML(total, active = 0) {
  return `<div class="slide-dots">${Array.from({ length: total }, (_, i) =>
    `<div class="dot${i === active ? " active" : ""}"></div>`
  ).join("")}</div>`;
}
