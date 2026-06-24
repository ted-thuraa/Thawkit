// scripts/build-iframe-css.mjs

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import chokidar from "chokidar";
import tailwindPostCssPlugin from "@tailwindcss/postcss"; // v4+ API
import postcss from "postcss";

// --- Configuration ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");

const CONFIG = {
  // FIX: Removed the incorrect "../" prefixes and kept all relevant globs.
  // We keep this list for the Chokidar watch mode, not for class extraction.
  INPUT_GLOBS: [
    "{src,app,components,pages}/**/*.{js,jsx,ts,tsx,html,hbs, mdx}",
    "src/**/*.{js,ts,jsx,tsx,mdx}",
    "src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "src/app/(main)/app/[appRef]/editor/**/*.tsx",
    "src/templates/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  OUTPUT_CSS_FILE: path.resolve(PROJECT_ROOT, "public/iframe.css"),
  SAFELIST_FILE: path.resolve(__dirname, "safelist-iframe.txt"),
  TW_CONFIG: path.resolve(PROJECT_ROOT, "tailwind.config.js"),
};

// --- Custom PostCSS Plugins ---

// The user provided the implementation of 'removeCommentRules' from the SO solution.
const removeCommentRules = (root) => {
  root.walkComments((comment) => {
    comment.remove();
  });
};

// NOTE: The SO solution included a 'prettier' function. For simplicity and
// speed, we omit it here, relying on standard PostCSS output.

// --- Key Algorithms: CSS Generation ---

/**
 * Builds the CSS file using Tailwind's automatic content detection.
 * The 'content' array/globs are handled by the Tailwind plugin itself, not manually.
 */
async function buildCss() {
  console.log(
    "⚙️ Generating CSS using Tailwind's automatic content detection..."
  );

  // Read safelist to convert it to content for Tailwind plugin
  const safelistClasses = await getSafelistClasses();

  // A tiny, transient CSS file to serve as the input for PostCSS/Tailwind
  // Based on the recommended imports from the Stack Overflow solution (excluding preflight)
  const tailwindInput = `
    

    @import "tailwindcss";
    @config "${CONFIG.TW_CONFIG}";

    @layer base {
      :root {
        --radius: 0.625rem;
        --background: oklch(100% 0.00011 271.152);
        --foreground: oklch(0.039 0.002 240);
        --card: oklch(1 0 0);
        --card-foreground: oklch(0.039 0.002 240);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.039 0.002 240);
        --primary: oklch(44.754% 0.26027 283.522);
        --primary-foreground: oklch(0.986 0.032 210);
        --secondary: oklch(0.96 0.008 240);
        --secondary-foreground: oklch(0.26 0.005 240);
        --muted: oklch(0.96 0.008 240);
        --muted-foreground: oklch(0.46 0.009 240);
        --accent: oklch(0.96 0.008 240);
        --accent-foreground: oklch(0.26 0.005 240);
        --destructive: oklch(0.456 0.278 25);
        --destructive-foreground: oklch(0.986 0.032 210);
        --border: oklch(0.9 0.015 240);
        --input: oklch(0.9 0.015 240);
        --ring: oklch(0.59 0.294 223);
        --success: oklch(0.318 0.236 138);
        --warning: oklch(0.517 0.339 47);
        --info: oklch(0.59 0.294 223);
        --chart-1: oklch(0.59 0.294 223);
        --chart-2: oklch(0.318 0.236 138);
        --chart-3: oklch(0.517 0.339 47);
        --chart-4: oklch(0.799 0.386 280);
        --chart-5: oklch(0.986 0.278 0);
        
        --editor-background: oklch(0.98 0.005 220);
        --editor-foreground: oklch(0.089 0.004 220);
        --editor-component: oklch(1 0 0);
        --editor-border: oklch(0.91 0.012 220);
        --editor-button: oklch(0.582 0.26 243.4);
        --info-foreground: var(--color-blue-700);
        --success-foreground: var(--color-emerald-700);
        --warning-foreground: var(--color-amber-700);
        --novel-highlight-default: #ffffff;
        --novel-highlight-purple: #f6f3f8;
        --novel-highlight-red: #fdebeb;
        --novel-highlight-yellow: #fbf4a2;
        --novel-highlight-blue: #c1ecf9;
        --novel-highlight-green: #acf79f;
        --novel-highlight-orange: #faebdd;
        --novel-highlight-pink: #faf1f5;
        --novel-highlight-gray: #f1f1ef;

        
      }
      
      /* If BASE_STYLES contains static CSS, paste it here instead of keeping it in JS */
    }
  `;

  // --- PostCSS Pipeline ---
  const twProcessor = tailwindPostCssPlugin({
    // IMPORTANT: Tailwind v4 automatically reads the 'content' key from tailwind.config.js
    // By passing an explicit 'content' array here, we override and provide our safelist classes.
    // content: [
    //   { raw: "", extension: "html", content: Array.from(safelistClasses) },
    // ],

    // We add the common safelist items manually if not covered by the safelist file.
    safelist: [
      ...Array.from(safelistClasses),
      "inter_1abc060f-module__U905BG__className",
      "::before",
      "::after",
      "container",
      "sr-only",
      "ring-offset-background",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2",
      "hover:bg-gray-700",
      "hover:bg-transparent",
    ],
    config: CONFIG.TW_CONFIG,
    // Add the 'optimize' key to leverage LightningCSS/PostCSS optimization
    optimize: {
      minify: false, // You can change this to true if you want minified output
    },
  });

  try {
    const result = await postcss([
      twProcessor,
      removeCommentRules, // Use the custom plugin to clean up comments
    ]).process(tailwindInput, {
      from: path.resolve(PROJECT_ROOT, "src"), // Use project root source context
      to: CONFIG.OUTPUT_CSS_FILE,
    });

    await fs.writeFile(CONFIG.OUTPUT_CSS_FILE, result.css);

    const sizeInKB = (Buffer.byteLength(result.css, "utf8") / 1024).toFixed(2);
    console.log(
      `✅ CSS generated successfully: ${CONFIG.OUTPUT_CSS_FILE} (${sizeInKB} KB)`
    );

    if (safelistClasses.size > 0) {
      console.log(
        `(Includes ${safelistClasses.size} classes from ${path.basename(CONFIG.SAFELIST_FILE)})`
      );
    }
  } catch (error) {
    console.error("❌ Tailwind CSS generation failed:", error);
  }
}

/**
 * Reads the safelist file and returns a set of classes.
 * (Unchanged from original)
 * @returns {Promise<Set<string>>}
 */
async function getSafelistClasses() {
  try {
    const content = await fs.readFile(CONFIG.SAFELIST_FILE, "utf-8");
    const classes = content
      .split(/\s+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    return new Set(classes);
  } catch (e) {
    if (e.code !== "ENOENT")
      console.warn(
        `⚠️ Warning: Could not read safelist file: ${CONFIG.SAFELIST_FILE}`,
        e
      );
    return new Set();
  }
}

// --- Main Execution ---

// Renamed fullScanAndBuild to runBuild for clarity
async function runBuild() {
  // Since Tailwind handles content detection, we just call the build function.
  await buildCss();
}

// --- Watch Mode ---

async function watchMode() {
  console.log("👀 Starting watch mode. Press Ctrl+C to exit...");
  await runBuild(); // Initial build

  // Watch all source files and the safelist file
  // We still need glob to list files for chokidar
  const globsToWatch = [...CONFIG.INPUT_GLOBS, CONFIG.SAFELIST_FILE];

  const watcher = chokidar.watch(globsToWatch, {
    ignored: CONFIG.OUTPUT_CSS_FILE,
    persistent: true,
    cwd: PROJECT_ROOT, // Crucial to keep the correct CWD for chokidar
  });

  watcher.on("change", async (filePath) => {
    console.log(`\n\n🔄 File changed: ${filePath}. Rebuilding...`);
    await runBuild(); // Full rebuild for simplicity/robustness in watch mode
  });

  watcher.on("error", (error) => console.error(`Watcher error: ${error}`));
}

if (process.argv.includes("--watch")) {
  watchMode();
} else {
  runBuild();
}
