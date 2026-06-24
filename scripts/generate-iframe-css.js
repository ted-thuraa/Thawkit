import { glob } from "glob";
import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// --- Configuration ---
const PROJECT_ROOT = process.cwd();
const CONTENT_GLOBS = [
  "./src/**/*.{js,jsx,ts,tsx,html}", // Next.js components, server-rendered templates
  "./src/app/(main)/app/[appRef]/editor/**/*.tsx", // User's specified path for editor components
  "./pages/**/*.{js,jsx,ts,tsx}",
  "./public/**/*.html", // Static HTML files
  // Add more globs as needed, e.g., for server-rendered templates
];
const SAFELIST_FILE = path.join(PROJECT_ROOT, ".tailwind-safelist.txt");
const OUTPUT_CSS_FILE = path.join(
  PROJECT_ROOT,
  "public",
  "iframe-tailwind.css"
);
const POSTCSS_CONFIG = path.join(PROJECT_ROOT, "postcss.config.js");

// Regex to find potential Tailwind classes in attributes (className, class, tw)
const CLASS_REGEX = /(?:className|class|tw)=["'`{]([^"'`}]*?)["'`}]/g;

// Heuristic to capture class strings assigned to variables (const/let/var)
const VARIABLE_CLASS_REGEX =
  /(?:const|let|var)\s+\w+\s*=\s*["'`]([^"'`]*?)["'`]/g;

// NEW: Regex to capture classes used as keys in object literals for conditional class utilities (e.g., cn({ 'class-name': condition }))
const CONDITIONAL_CLASS_REGEX = /['"]([^'"]+)['"]\s*:/g;

/**
 * Extracts potential Tailwind classes from a file's content.
 * @param {string} content The file content.
 * @returns {Set<string>} A set of unique classes.
 */
function extractClasses(content) {
  const classes = new Set();

  // 1. Extract classes from JSX/HTML attributes (className, class, tw)
  const attributeMatches = content.matchAll(CLASS_REGEX);
  for (const match of attributeMatches) {
    processClassString(match[1], classes);
  }

  // 2. Extract classes from variable assignments (heuristic for dynamic strings)
  const variableMatches = content.matchAll(VARIABLE_CLASS_REGEX);
  for (const match of variableMatches) {
    processClassString(match[1], classes);
  }

  // 3. Extract classes from conditional object keys (e.g., cn({ 'class': condition }))
  const conditionalMatches = content.matchAll(CONDITIONAL_CLASS_REGEX);
  for (const match of conditionalMatches) {
    // match[1] is the class name key
    processClassString(match[1], classes);
  }

  return classes;
}

/**
 * Processes a raw string captured by regex to extract individual class names.
 * @param {string} rawString The string captured by the regex.
 * @param {Set<string>} classes The set to add extracted classes to.
 */
function processClassString(rawString, classes) {
  let classString = rawString.trim();

  if (classString) {
    // Clean up the string by removing commas, quotes, and backticks.
    // This handles array-like syntax captured by the regex, e.g., ['class1', 'class2']
    // and ensures that complex arbitrary variants are not broken.
    classString = classString.replace(/['",`]/g, " ");

    // Split by space and add to the set
    classString.split(/\s+/).forEach((cls) => {
      // The class name must not be empty and must not be a bracket (from array syntax)
      if (cls && cls !== "[" && cls !== "]") classes.add(cls);
    });
  }
}

/**
 * Handles "DB-provided classes" and other dynamic classes by adding them
 * to a persistent safelist. In a real-world scenario, this list would be
 * maintained manually or via a separate build step that analyzes DB schema.
 * For this implementation, we will include a few common dynamic patterns.
 * @returns {Set<string>} A set of classes to always include.
 */
function getDynamicSafelist() {
  // In a real application, this would be populated from a known list of
  // classes that are dynamically generated (e.g., from a CMS or DB).
  // For demonstration, we include a few common dynamic classes.
  return new Set([
    // Example dynamic classes that might be concatenated:
    "text-red-500",
    "bg-blue-100",
    "p-4",
    "hover:bg-gray-200",
    // Classes that are often used in template literals or cn() helpers:
    "flex",
    "items-center",
    "justify-between",
    "w-full",
  ]);
}

/**
 * Scans the project files for Tailwind classes and generates the safelist file.
 * @returns {Promise<Set<string>>} The set of all extracted classes.
 */
async function scanAndGenerateSafelist() {
  console.log("Scanning project files for Tailwind classes...");
  const allClasses = getDynamicSafelist();
  const files = await glob(CONTENT_GLOBS, {
    cwd: PROJECT_ROOT,
    absolute: false,
  });

  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const extracted = extractClasses(content);
      extracted.forEach((cls) => allClasses.add(cls));
    } catch (error) {
      console.error(`Error reading file ${file}:`, error.message);
    }
  }

  // Write the unique classes to the safelist file, one class per line.
  const safelistContent = Array.from(allClasses).join("\n");
  await fs.writeFile(SAFELIST_FILE, safelistContent);
  console.log(
    `Safelist generated with ${allClasses.size} classes: ${SAFELIST_FILE}`
  );

  return allClasses;
}

/**
 * Generates the final CSS file using PostCSS and Tailwind.
 * @param {boolean} isProd Whether to run in production mode (minification).
 */
async function generateCss(isProd) {
  console.log("Generating iframe CSS...");

  // 1. Create a temporary input file for PostCSS.
  // This file ensures the base styles and the Tailwind directives are included.
  const INPUT_CSS_FILE = path.join(PROJECT_ROOT, "temp-input.css");
  const inputContent = `
    /* Tailwind directives - only utilities are needed as preflight is disabled */
    @tailwind utilities;
    /* The custom plugin in tailwind.config.js handles the ::before/::after content */
  `;
  await fs.writeFile(INPUT_CSS_FILE, inputContent);

  // 2. Construct the PostCSS command.
  const envVars = `NODE_ENV=${isProd ? "production" : "development"}`;
  const minifyFlag = isProd ? " --no-map" : ""; // PostCSS CLI minifies in production mode by default
  const command = `${envVars} npx postcss ${INPUT_CSS_FILE} --config ${POSTCSS_CONFIG} -o ${OUTPUT_CSS_FILE}${minifyFlag}`;

  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: PROJECT_ROOT,
    });
    if (stderr) {
      console.error("PostCSS stderr:", stderr);
    }
    console.log(`CSS generated successfully at ${OUTPUT_CSS_FILE}`);
    if (isProd) {
      console.log("Output is minified.");
    }
  } catch (error) {
    console.error("Error during PostCSS execution:", error.message);
    throw error;
  } finally {
    // Clean up the temporary input file
    await fs.unlink(INPUT_CSS_FILE);
  }
}

/**
 * Main function to run the process.
 * @param {boolean} isProd Whether to run in production mode.
 */
async function main(isProd = false) {
  try {
    // Ensure the output directory exists
    await fs.mkdir(path.dirname(OUTPUT_CSS_FILE), { recursive: true });

    // 1. Scan files and generate the safelist
    await scanAndGenerateSafelist();

    // 2. Generate the CSS
    await generateCss(isProd);

    console.log("Iframe CSS generation complete.");
  } catch (error) {
    console.error(`Iframe CSS generation failed: ${error.message}`);
    process.exit(1);
  }
}

// Check for command line arguments to determine mode
const isProduction = process.argv.includes("--production");
main(isProduction);
