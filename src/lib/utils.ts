import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { projectFormSchema } from "./validators/project";
import z from "zod";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Processes inline styles to ensure they have higher specificity
 * by adding !important to each style property
 *
 * @param styles - The original style object
 * @returns - A new style object with !important added to each property
 */
export function prioritizeStyles(
  styles?: React.CSSProperties,
): React.CSSProperties {
  if (!styles) return {};

  return styles;
}

/**
 * Creates a class string that follows the theme hierarchy
 * - Base theme classes come first
 * - Custom classes are added after to override theme classes
 *
 * @param baseThemeClass - Base theme class to apply
 * @param customClasses - Custom classes that should override theme classes
 * @returns - A string of classes in the correct hierarchy
 */
export function hierarchicalClasses(
  baseThemeClass: string,
  customClasses?: string,
): string {
  return cn(
    // Base theme classes
    baseThemeClass,
    // Text content class is used in theme.ts for text styling
    // Custom classes override theme classes
    customClasses,
  );
}

/**
 * Slugifies a string for use in URLs/domains.
 * - Converts to lowercase
 * - Removes special characters
 * - Replaces spaces with hyphens
 * - Trims leading/trailing hyphens
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Creates a short, unique domain slug.
 * Takes the first 2 words of the title, slugifies them,
 * and appends a unique ID.
 */
export function createDomainSlug(title: string, uniqueId: string): string {
  // 1. Slugify the title and take the first two "words"
  const slugBase = slugify(title).split("-").slice(0, 2).join("-");

  // 2. Handle empty/invalid titles (e.g., "!") by providing a default
  const finalBase = slugBase.length > 0 ? slugBase : "project";

  // 3. Combine with the unique ID
  return `${finalBase}-${uniqueId}`;
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Convert to different time units
  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Average month length
  const years = Math.floor(days / 365.25); // Account for leap years

  // Return the most appropriate time format
  if (seconds < 60) {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (weeks < 4) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}

/**
 * Extracts plain text from a string that may contain simple HTML tags.
 * Handles basic HTML tags (non-nested) and decodes HTML entities.
 *
 * @param text - The input text that may contain HTML tags
 * @returns The plain text without HTML tags and with decoded entities
 */
export const extractTextFromHtml = (text: string): string => {
  // If text is null, undefined, or not a string, return empty string
  if (!text || typeof text !== "string") {
    return "";
  }

  // First decode HTML entities
  const decodeEntities = (str: string): string => {
    const element = document.createElement("div");
    element.innerHTML = str;
    return element.textContent || element.innerText || "";
  };

  // Remove HTML tags and decode entities
  const plainText = text
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .trim(); // Remove leading/trailing whitespace

  return decodeEntities(plainText);
};

/**
 * Generates a new unique ID, preserving the original prefix if present.
 * e.g., "section-abc" -> "section-xyz"
 * @param originalId The original ID string.
 * @returns A new unique ID string.
 */
const generateNewId = (originalId: string): string => {
  const parts = originalId.split("-");
  // Check if the ID starts with a known prefix (e.g., "section-", "container-", "text-")
  if (parts.length > 1) {
    // Rejoin all parts except the last (the old ID) to get the prefix
    const prefix = parts.slice(0, -1).join("-");
    return `${prefix}-${nanoid(8)}`;
  }
  return nanoid(8); // Fallback for IDs without a prefix
};

export const sanitizeDomain = (domain: string): string => {
  let cleanedDomain = domain;
  if (cleanedDomain.endsWith("/")) {
    cleanedDomain = cleanedDomain.slice(0, -1);
  }
  if (cleanedDomain.endsWith(".")) {
    cleanedDomain = cleanedDomain.slice(0, -1);
  }
  return cleanedDomain;
};

// export function sortScoreTiersByRange(tiers: Array<ScoreTiers>) {
//   if (!Array.isArray(tiers)) return [];

//   return [...tiers].sort((a, b) => a.scoreFrom - b.scoreFrom);
// }

export const getBrightness = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}) => (r * 299 + g * 587 + b * 114) / 1000;

// 2. The Helper: Converts Hex to RGBA object
export const hexToRgb = (hex: string) => {
  // Remove the hash if present
  const cleanHex = hex.replace(/^#/, "");

  // Expand short hex (e.g., "03F" -> "0033FF") to full 6 or 8 chars
  const fullHex =
    cleanHex.length === 3 || cleanHex.length === 4
      ? cleanHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanHex;

  // Parse integer values
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Handle Alpha (if 8 chars, parse it; otherwise default to 1)
  const a =
    fullHex.length === 8 ? parseInt(fullHex.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
};

function hexToRgbStruct(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates a dynamic palette based on background color.
 * Returns CSS variable values.
 */
export function getSmartPalette(hexBg: string | undefined | null) {
  // 1. Safety check
  if (!hexBg || typeof hexBg !== "string" || !hexBg.startsWith("#")) {
    // Return empty object so we inherit from parent scope
    return {};
  }

  const rgb = hexToRgbStruct(hexBg);
  if (!rgb) return {};

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  // Threshold 0.5 is standard, but 0.45 often feels better for "dark mode" triggers
  const isDark = luminance < 0.45;

  // Colors
  const textBase = isDark ? "255, 255, 255" : "15, 23, 42"; // White vs Slate-900
  const inputBg = isDark ? "255, 255, 255" : "0, 0, 0";

  return {
    "--theme-bg-surface": hexBg,

    // Text Colors (Using RGB values so we can use opacity in CSS)
    "--theme-heading-color": `rgba(${textBase}, 1)`,
    "--theme-body-color": `rgba(${textBase}, 0.85)`,
    "--theme-muted-color": `rgba(${textBase}, 0.60)`,

    // Border / Lines
    "--theme-border-color": `rgba(${textBase}, 0.2)`,

    // Form Elements (Inputs need to contrast against the surface)
    "--theme-input-bg": `rgba(${inputBg}, 0.05)`,
    "--theme-input-border": `rgba(${textBase}, 0.15)`,
    "--theme-input-text": `rgba(${textBase}, 1)`,
    "--theme-input-placeholder": `rgba(${textBase}, 0.5)`,
  } as React.CSSProperties;
}

export function getCardSmartPalette(hexBg: string | undefined | null) {
  // 1. Safety check
  if (!hexBg || typeof hexBg !== "string" || !hexBg.startsWith("#")) {
    // Return empty object so we inherit from parent scope
    return {};
  }

  const rgb = hexToRgbStruct(hexBg);
  if (!rgb) return {};

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  // Threshold 0.5 is standard, but 0.45 often feels better for "dark mode" triggers
  const isDark = luminance < 0.45;

  // Colors
  const textBase = isDark ? "255, 255, 255" : "15, 23, 42"; // White vs Slate-900
  const inputBg = isDark ? "255, 255, 255" : "0, 0, 0";

  return {
    "--theme-card-bg": hexBg,

    // Text Colors (Using RGB values so we can use opacity in CSS)
    "--theme-heading-color": `rgba(${textBase}, 1)`,
    "--theme-body-color": `rgba(${textBase}, 0.85)`,
    "--theme-muted-color": `rgba(${textBase}, 0.60)`,
    // Border / Lines
    "--theme-border-color": `rgba(${textBase}, 0.2)`,
    // Form Elements (Inputs need to contrast against the surface)
    "--theme-input-bg": `rgba(${inputBg}, 0.05)`,
    "--theme-input-border": `rgba(${textBase}, 0.15)`,
    "--theme-input-text": `rgba(${textBase}, 1)`,
    "--theme-input-placeholder": `rgba(${textBase}, 0.5)`,
  } as React.CSSProperties;
}
