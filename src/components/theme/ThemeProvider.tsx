"use client";

import React, { useMemo } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { FunnelTheme } from "@/types/PageCMS/pageSchema";
import { THEME_DEFAULTS, buildCssVars } from "@/lib/utils/themeUtils";
import { useFontLoader } from "@/hooks/useFontLoader";

type Props = {
  children: React.ReactNode;
};

/**
 * Deep-merges an operator-defined theme over THEME_DEFAULTS, field by field.
 * A funnel that only customises e.g. `palette.primary_accent` still inherits
 * correct defaults for every other token — nothing is ever undefined
 * downstream, so consuming components never need their own fallback logic.
 */
function resolveTheme(theme: Partial<FunnelTheme> | undefined): FunnelTheme {
  if (!theme) return THEME_DEFAULTS;

  return {
    colors: {
      page_background:
        theme.colors?.page_background ?? THEME_DEFAULTS.colors.page_background,
      card_background:
        theme.colors?.card_background ?? THEME_DEFAULTS.colors.card_background,
      text: {
        heading:
          theme.colors?.text?.heading ?? THEME_DEFAULTS.colors.text.heading,
        body: theme.colors?.text?.body ?? THEME_DEFAULTS.colors.text.body,
        link: theme.colors?.text?.link ?? THEME_DEFAULTS.colors.text.link,
      },
    },
    palette: {
      primary_accent:
        theme.palette?.primary_accent ?? THEME_DEFAULTS.palette.primary_accent,
      secondary_accent:
        theme.palette?.secondary_accent ??
        THEME_DEFAULTS.palette.secondary_accent,
    },
    typography: {
      headings: {
        family:
          theme.typography?.headings?.family ??
          THEME_DEFAULTS.typography.headings.family,
        weight:
          theme.typography?.headings?.weight ??
          THEME_DEFAULTS.typography.headings.weight,
      },
      body: {
        family:
          theme.typography?.body?.family ??
          THEME_DEFAULTS.typography.body.family,
        weight:
          theme.typography?.body?.weight ??
          THEME_DEFAULTS.typography.body.weight,
      },
    },
  };
}

/**
 * ThemeProvider — root-level theming boundary for the public funnel runner.
 *
 * Reads `schema.theme` from the Zustand store, resolves it against
 * THEME_DEFAULTS, and injects the full `--tk-*` CSS variable set via an
 * inline `style` prop on a single wrapper div — the highest-specificity,
 * zero-stylesheet mechanism available. No CSS files, no styled-components,
 * no CSS modules.
 *
 * Applies the spec's visual hierarchy in order:
 *   1. Environment  → page background (colour, with image/video layered on top).
 *   2. Typography   → font-family + base text colour set on the root div,
 *                      cascading to every descendant by default.
 *   3. Interactive   → accent tokens are exposed as CSS vars for buttons/links
 *                      to consume individually (contrast-checked automatically).
 */
export function ThemeProvider({ children }: Props) {
  const schema = useFunnelStore((s) => s.schema);

  // Re-resolve only when schema.theme's identity actually changes.
  const theme = useMemo(() => resolveTheme(schema?.theme), [schema?.theme]);
  const cssVars = useMemo(() => buildCssVars(theme), [theme]);

  useFontLoader(theme.typography.headings, theme.typography.body);

  const pageBg = theme.colors.page_background;
  const hasMediaBackground = pageBg.type === "image" || pageBg.type === "video";

  return (
    <div
      className="relative min-h-screen"
      style={
        {
          ...cssVars,
          backgroundColor: "var(--tk-page-bg)",
          color: "var(--tk-text-body)",
          fontFamily: "var(--tk-font-body)",
          fontWeight: "var(--tk-font-body-weight)",
        } as React.CSSProperties
      }
    >
      {/* ── Media background layer ──────────────────────────────────────────
          Only rendered when an image/video source is configured. The solid
          --tk-page-bg colour set above remains visible underneath as the
          fallback while the media asset loads — per the spec's fallback rule. */}
      {hasMediaBackground && pageBg.type === "image" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pageBg.value})` }}
        />
      )}
      {hasMediaBackground && pageBg.type === "video" && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        >
          <source src={pageBg.value} />
        </video>
      )}

      {/* ── Content layer — sits above any media background ── */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
