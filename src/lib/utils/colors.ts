/**
 * Parses a CSS color string (hex #RRGGBB, #RGB, rgb(r, g, b)) into its RGB components.
 * Returns null if parsing fails.
 */
export function parseColor(
  color: string
): { r: number; g: number; b: number } | null {
  if (!color) return null;

  // Remove whitespace and convert to lowercase
  color = color.trim().toLowerCase();

  // Hex format (#RGB)
  if (color.startsWith("#") && color.length === 4) {
    let hex = color.substring(1);
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  // Hex format (#RRGGBB)
  if (color.startsWith("#") && color.length === 7) {
    let hex = color.substring(1);
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  // RGB format (rgb(r, g, b))
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      return { r, g, b };
    }
  }

  // RGBA format (rgba(r, g, b, a)) - Ignores alpha for contrast calculation
  const rgbaMatch = color.match(
    /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/
  );
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      return { r, g, b };
    }
  }

  // Add support for basic color names if needed
  // const basicColors: { [key: string]: string } = { white: '#ffffff', black: '#000000', ... };
  // if (basicColors[color]) return parseColor(basicColors[color]);

  console.warn(`Could not parse color: ${color}`);
  return null;
}

/**
 * Calculates the relative luminance of an RGB color.
 * Formula from WCAG: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * Input values r, g, b are 0-255.
 */
export function getRelativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  const RsRGB = rgb.r / 255;
  const GsRGB = rgb.g / 255;
  const BsRGB = rgb.b / 255;

  const R =
    RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
  const G =
    GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
  const B =
    BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

  // For the formula to work, R, G, and B need to be normalized to 0..1
  // corrected calculation
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates the contrast ratio between two CSS color strings.
 * Formula from WCAG: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(
  color1: string,
  color2: string
): number | null {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) {
    console.warn(
      `Could not calculate contrast. Parsing failed for: ${!rgb1 ? color1 : ""} ${!rgb2 ? color2 : ""}`
    );
    return null; // Cannot calculate if parsing fails
  }

  const luminance1 = getRelativeLuminance(rgb1);
  const luminance2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  // Ratio is calculated as (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter luminance
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return parseFloat(ratio.toFixed(2)); // Return ratio rounded to 2 decimal places
}

/**
 * Determines the best text color from a list of options for a given background color
 * based on WCAG contrast ratio (AA standard: 4.5:1).
 *
 * @param backgroundColor The background color string.
 * @param textColorOptions An array of potential text colors to test (e.g., ['#FFFFFF', '#000000']).
 * @param minContrast The minimum acceptable contrast ratio (default: 4.5).
 * @returns The first color from textColorOptions that meets the minimum contrast, or the option with the highest contrast if none meet the minimum. Returns null if background parsing fails.
 */
export function getAccessibleTextColor(
  backgroundColor: string,
  textColorOptions: string[],
  minContrast: number = 4.5
): string | null {
  if (!textColorOptions || textColorOptions.length === 0) {
    console.error(
      "textColorOptions array must be provided and contain at least one color."
    );
    return "#000000"; // Default fallback if options are missing
  }

  const backgroundRgb = parseColor(backgroundColor);
  if (!backgroundRgb) {
    console.warn(
      `Could not determine accessible text color because background color "${backgroundColor}" could not be parsed.`
    );
    return textColorOptions[0]; // Return first option if background is invalid
  }

  let bestColor = null;
  let maxRatio = 0;

  for (const textColor of textColorOptions) {
    const ratio = getContrastRatio(backgroundColor, textColor);

    if (ratio !== null) {
      // If it meets the minimum contrast, return it immediately
      if (ratio >= minContrast) {
        return textColor;
      }
      // Otherwise, track the color with the highest ratio found so far
      if (ratio > maxRatio) {
        maxRatio = ratio;
        bestColor = textColor;
      }
    }
  }

  // If no color met the minimum contrast, return the one that had the best ratio
  if (bestColor) {
    console.warn(
      `No text color option (${textColorOptions.join(", ")}) provided sufficient contrast (${minContrast}:1) for background ${backgroundColor}. Using ${bestColor} as fallback (Ratio: ${maxRatio}:1).`
    );
    return bestColor;
  } else {
    // This case should ideally not happen if options are provided and parsing works
    console.error(
      `Could not determine any contrast ratio for background ${backgroundColor} with options ${textColorOptions.join(", ")}.`
    );
    return textColorOptions[0]; // Fallback to the first option
  }
}
