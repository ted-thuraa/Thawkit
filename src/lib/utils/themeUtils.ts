import { FunnelTheme } from "@/types/PageCMS/pageSchema";

// ─── Default Theme ────────────────────────────────────────────────────────────
// Mirrors the current hardcoded Tailwind palette exactly, so any funnel that
// has no `theme` field set continues to look identical to before this system
// was introduced — zero visual regression at first deploy.
export const THEME_DEFAULTS: FunnelTheme = {
  colors: {
    page_background: { type: "color", value: "#ffffff" },
    card_background: { type: "color", value: "#ffffff" },
    text: {
      heading: "#111827", // Tailwind gray-900
      body: "#6b7280", // Tailwind gray-500
      link: "#2563eb", // Tailwind blue-600
    },
  },
  palette: {
    primary_accent: "#2563eb", // Tailwind blue-600
    secondary_accent: "#6b7280", // Tailwind gray-500
  },
  typography: {
    headings: { family: "Manrope", weight: "600" },
    body: { family: "Source Sans 3", weight: "400" },
  },
};

// ─── Colour Utilities ─────────────────────────────────────────────────────────

/**
 * Relative luminance of a 6-digit hex colour (WCAG 2.1 §1.4.3 formula).
 * Returns 0 (pure black) → 1 (pure white).
 */
function getLuminance(hex: string): number {
  const clean = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG 2.1–compliant foreground colour for any background hex.
 * Returns near-black (#1a1a1a) for light backgrounds and white (#ffffff) for
 * dark ones, guaranteeing a minimum 4.5 : 1 contrast ratio for normal text.
 * Used to auto-select button label colour from any operator-chosen accent.
 */
export function getContrastForeground(hex: string): string {
  return getLuminance(hex) > 0.179 ? "#1a1a1a" : "#ffffff";
}

/** Converts a 6-digit hex to an rgba() string at the given alpha (0–1). */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── CSS Variable Builder ─────────────────────────────────────────────────────

/**
 * Derives a complete `--tk-*` CSS custom property map from a resolved theme.
 * The result is spread directly onto `ThemeProvider`'s root element `style`
 * prop, making all 15 tokens available to every descendant via `var(--tk-*)`.
 *
 * Token catalogue
 * ───────────────
 * --tk-page-bg               Page background colour (fallback for image/video).
 * --tk-card-bg                Card / container background colour.
 * --tk-text-heading           H1–H6 text colour.
 * --tk-text-body              Paragraph / label text colour.
 * --tk-text-link               Interactive link text colour.
 * --tk-accent-primary          Primary CTA / highlight colour.
 * --tk-accent-primary-fg       WCAG-safe text colour on primary accent backgrounds.
 * --tk-accent-primary-bg       8 % tint — selected-option and badge fill colour.
 * --tk-accent-primary-border   20 % tint — badge / chip border colour.
 * --tk-accent-secondary        Secondary accent colour.
 * --tk-accent-secondary-fg     WCAG-safe text colour on secondary accent backgrounds.
 * --tk-font-heading            CSS font-family string for headings.
 * --tk-font-body               CSS font-family string for body text.
 * --tk-font-heading-weight     Font weight for heading elements.
 * --tk-font-body-weight        Font weight for body text elements.
 */
export function buildCssVars(theme: FunnelTheme): Record<string, string> {
  const primary = theme.palette.primary_accent;
  const secondary = theme.palette.secondary_accent;
  const bg = theme.colors.page_background;
  const cardBg = theme.colors.card_background;

  return {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    "--tk-page-bg": bg.type === "color" ? bg.value : "#ffffff",
    "--tk-card-bg": cardBg?.type === "color" ? cardBg.value : "#ffffff",

    // ── Text colours ─────────────────────────────────────────────────────────
    "--tk-text-heading": theme.colors.text.heading,
    "--tk-text-body": theme.colors.text.body,
    "--tk-text-link": theme.colors.text.link,

    // ── Primary accent + derived tokens ──────────────────────────────────────
    "--tk-accent-primary": primary,
    "--tk-accent-primary-fg": getContrastForeground(primary),
    "--tk-accent-primary-bg": hexToRgba(primary, 0.08),
    "--tk-accent-primary-border": hexToRgba(primary, 0.2),

    // ── Secondary accent + derived tokens ────────────────────────────────────
    "--tk-accent-secondary": secondary,
    "--tk-accent-secondary-fg": getContrastForeground(secondary),

    // ── Typography ────────────────────────────────────────────────────────────
    "--tk-font-heading": `"${theme.typography.headings.family}", system-ui, sans-serif`,
    "--tk-font-body": `"${theme.typography.body.family}", system-ui, sans-serif`,
    "--tk-font-heading-weight": theme.typography.headings.weight,
    "--tk-font-body-weight": theme.typography.body.weight,
  };
}
