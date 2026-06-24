"use client";

import { useEffect } from "react";
import { FunnelThemeFontToken } from "@/types/PageCMS/pageSchema";

// Module-level cache shared across all hook calls and component re-mounts
// (not per-component state) — guarantees a given family+weight pairing is
// ever injected into <head> exactly once per browser session, regardless
// of how many ThemeProvider instances mount/unmount (builder previews,
// retake-funnel remounts, etc).
const injectedFontKeys = new Set<string>();

/**
 * Loads a heading/body Google Fonts pairing by injecting a single
 * <link rel="stylesheet"> into <head>, idempotently. SSR-safe — the effect
 * body only runs client-side, and the dedup check also looks for a
 * pre-existing <link> (covers Fast Refresh in dev re-running this module).
 */
export function useFontLoader(
  heading: FunnelThemeFontToken,
  body: FunnelThemeFontToken,
): void {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const cacheKey = `${heading.family}:${heading.weight}|${body.family}:${body.weight}`;
    if (injectedFontKeys.has(cacheKey)) return;

    // De-dupe identical font families that request different weights into a
    // single family= param with a combined wght@ axis list.
    const familyWeights = new Map<string, Set<string>>();
    [heading, body].forEach(({ family, weight }) => {
      if (!familyWeights.has(family)) familyWeights.set(family, new Set());
      familyWeights.get(family)!.add(weight);
    });

    const familyQuery = Array.from(familyWeights.entries())
      .map(([family, weights]) => {
        const encodedFamily = family.trim().replace(/\s+/g, "+");
        const weightAxis = Array.from(weights).sort().join(";");
        return `family=${encodedFamily}:wght@${weightAxis}`;
      })
      .join("&");

    const href = `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`;

    // Guard against a link already present from a prior mount that ran
    // before this module's in-memory Set was (re-)populated.
    if (document.querySelector(`link[data-tk-font="${cacheKey}"]`)) {
      injectedFontKeys.add(cacheKey);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.tkFont = cacheKey;
    document.head.appendChild(link);

    injectedFontKeys.add(cacheKey);
  }, [heading.family, heading.weight, body.family, body.weight]);
}
