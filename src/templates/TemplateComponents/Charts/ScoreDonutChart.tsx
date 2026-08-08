"use client";

/**
 * ScoreDonutChart
 * ────────────────
 * Donut chart replacement for the plain SVG ScoreDial, built on @nivo/pie.
 * Each ring segment is a category score; segment color is driven by that
 * category's resolved ScoreTier. The overall score renders as a custom
 * center layer.
 *
 * ── Root cause of the earlier "Cannot read properties of null (reading
 *    'map')" crash ──────────────────────────────────────────────────────
 * The installed @nivo/pie (0.99.0) is Nivo's rewritten v1 line. In this
 * version, the ComputedDatum handed to `colors` (when a function),
 * `arcLabel`, `arcLinkLabel`, and `tooltip` callbacks is a FLAT spread
 * merge of the raw datum plus computed fields — `{ ...rawDatum, color,
 * arc, ... }` — NOT the classic v0.8x shape where those callbacks receive
 * `{ ...computed, data: rawDatum }` with the raw fields nested under
 * `.data`. Earlier revisions of this component assumed the old nested
 * shape everywhere (`datum.data.category...`), so every accessor was
 * silently reading through `undefined`, corrupting Nivo's internal
 * per-arc pipeline before a downstream `.map()` call threw.
 *
 * Confirmed against a previously working ResultPieChart component built on
 * the identical @nivo/pie@0.99.0 / React 19.1.0 versions, which reads every
 * field flat off `datum` (`datum.color`, `datum.value`, `datum.label`) and
 * uses a path-based `colors={{ datum: "color" }}` accessor rather than a
 * function. This rewrite mirrors that proven pattern exactly.
 *
 * ── Theme compatibility ──────────────────────────────────────────────────
 * No colors are hardcoded. Two independent sources feed the chart:
 *   1. Data-driven: each arc's fill is `category.tier.color` (an
 *      operator-configured ScoreTier), precomputed onto a flat `color`
 *      field per datum in toDonutData() and read via the `{ datum: "color" }`
 *      path accessor. Falls back to a *resolved* (never raw var()) accent
 *      token only when a category has no tier.
 *   2. Theme-driven: all text (center score, arc labels, tooltip chrome)
 *      reads `var(--tk-*)` custom properties directly as plain SVG/CSS
 *      `fill`/`color` values, which the browser resolves natively — safe
 *      everywhere EXCEPT inside nivo's `{ from: "color", modifiers: [...] }`
 *      color-math configs, which require the underlying `color` field
 *      itself to already be a concrete hex (see useResolvedCssVar below).
 * ──────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useMemo, useState } from "react";
import { ResponsivePie, PieCustomLayerProps } from "@nivo/pie";
import { CategoryScoreResult, ScoreTier } from "@/types/PageCMS/pageSchema";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Raw datum shape fed to nivo. Flat by design (see file header) — `color`
 * and `category` sit directly on this object because nivo 0.99 spreads the
 * raw datum's own fields straight onto the ComputedDatum it hands back into
 * every accessor/callback. `category` carries the full CategoryScoreResult
 * through untouched so DonutTooltip can show tier/points detail without a
 * secondary lookup.
 */
export interface ScoreDonutDatum {
  id: string;
  value: number;
  label: string;
  /** Concrete resolved hex — never a raw var(...) string. See toDonutData(). */
  color: string;
  category: CategoryScoreResult;
}

export type ScoreDonutChartProps = {
  /** Category scores to render as ring segments. */
  categories: CategoryScoreResult[];
  /** 0–100 overall score rendered in the donut's center. */
  overallScore: number;
  /** Resolved tier for the overall score — shown as the center caption. */
  overallTier?: ScoreTier | null;
  /** Chart diameter in px. */
  size?: number;
};

// ─── CSS variable resolution ──────────────────────────────────────────────────
//
// borderColor / arcLabelsTextColor below use `{ from: "color", modifiers:
// [...] }`, which asks nivo to run each arc's resolved `color` field
// through d3/colord color math (e.g. "darker"). That parser can't resolve
// CSS custom properties, so the `color` field itself — and this fallback —
// must always be a concrete hex, resolved once here via getComputedStyle
// (same idiom as useFontLoader.ts's module-level caching pattern).
function useResolvedCssVar(varName: string, fallbackHex: string): string {
  const [resolved, setResolved] = useState(fallbackHex);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (raw) setResolved(raw);
  }, [varName]);

  return resolved;
}

// ─── Data shaping ─────────────────────────────────────────────────────────────

/**
 * Converts CategoryScoreResult[] into nivo's expected flat datum shape.
 *
 * Categories with zero max points (no scoreable questions reached yet) are
 * dropped entirely rather than forced into a meaningless 0% slice. A
 * genuinely-scored zero is floored to 0.001 so nivo doesn't collapse that
 * arc to nothing — arcLabel below still displays the true rounded score.
 */
function toDonutData(
  categories: CategoryScoreResult[],
  fallbackColor: string,
): ScoreDonutDatum[] {
  return categories
    .filter((c) => c.maxPoints > 0)
    .map((category) => ({
      id: category.categoryId,
      value: Math.max(category.score, 0.001),
      label: category.categoryTitle,
      color: category.tier?.color ?? fallbackColor,
      category,
    }));
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
//
// `datum` is FLAT (see file header) — category/label/value/color are all
// top-level, exactly like the proven-working ResultPieChart's tooltip.
function DonutTooltip({ datum }: { datum: ScoreDonutDatum }) {
  const { category, color } = datum;
  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-sm"
      style={{
        backgroundColor: "var(--tk-card-bg)",
        borderColor: color,
        color: "var(--tk-text-body)",
      }}
    >
      <div
        className="flex items-center gap-1.5 font-semibold"
        style={{ color: "var(--tk-text-heading)" }}
      >
        {category.categoryIcon && (
          <span aria-hidden="true">{category.categoryIcon}</span>
        )}
        {category.categoryTitle}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-bold tabular-nums">{category.score}%</span>
        <span style={{ opacity: 0.7 }}>
          ({category.earnedPoints} / {category.maxPoints} pts)
        </span>
      </div>
      {category.tier && (
        <span
          className="mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold"
          style={{
            color: category.tier.color,
            borderColor: category.tier.color,
            backgroundColor: `${category.tier.color}1A`,
          }}
        >
          {category.tier.label}
        </span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ScoreDonutChart({
  categories,
  overallScore,
  overallTier,
  size = 280,
}: ScoreDonutChartProps) {
  const accentFallback = useResolvedCssVar("--tk-accent-primary", "#0B3D36");

  const data = useMemo(
    () => toDonutData(categories, accentFallback),
    [categories, accentFallback],
  );

  const nivoTheme = useMemo(
    () => ({
      text: { fill: "var(--tk-text-body)", fontFamily: "var(--tk-font-body)" },
      labels: {
        text: { fill: "var(--tk-text-heading)", fontSize: 11, fontWeight: 600 },
      },
      tooltip: {
        container: { background: "transparent", boxShadow: "none", padding: 0 },
      },
    }),
    [],
  );

  // ── Center overlay ────────────────────────────────────────────────────────
  // Defined INSIDE the component body so it closes over overallScore /
  // overallTier directly — mirrors the proven-working ResultPieChart's
  // CenteredMetric exactly. Nivo invokes layer components with only its own
  // PieCustomLayerProps; extra props can't be threaded through the `layers`
  // array any other way, so closing over outer scope (rather than wrapping
  // in an inline arrow function inside `layers`) is the correct pattern.
  const CenteredMetric = ({
    centerX,
    centerY,
  }: PieCustomLayerProps<ScoreDonutDatum>) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
    >
      <tspan
        x={centerX}
        dy="-0.3em"
        style={{
          fontSize: 30,
          fontWeight: 700,
          fill: "var(--tk-text-heading)",
          fontFamily: "var(--tk-font-heading)",
        }}
      >
        {overallScore}%
      </tspan>
      <tspan
        x={centerX}
        dy="1.6em"
        style={{
          fontSize: 11,
          fontWeight: overallTier ? 600 : 400,
          fill: overallTier ? overallTier.color : "var(--tk-text-body)",
        }}
      >
        {overallTier ? overallTier.label : "overall"}
      </tspan>
    </text>
  );

  if (data.length === 0) return null;

  return (
    <div
      style={{ width: size, height: size, position: "relative" }}
      role="img"
      aria-label={`Overall score ${overallScore}%, broken down by ${data.length} categories`}
    >
      <ResponsivePie<ScoreDonutDatum>
        data={data}
        theme={nivoTheme}
        innerRadius={0.65}
        padAngle={1.2}
        cornerRadius={3}
        activeOuterRadiusOffset={6}
        activeInnerRadiusOffset={6}
        sortByValue={false} // preserve questionCategories order, not score order
        margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
        // ── Data-driven color: path accessor, not a function ──────────────
        // Matches the proven-working pattern exactly — `{ datum: "color" }`
        // tells nivo to read the flat `color` field straight off each raw
        // datum. This is the confirmed-stable form against this package
        // version (a function accessor is also technically valid in this
        // API, but must index the datum flat: `(d) => d.color`, never
        // `d.data.color`).
        colors={{ datum: "color" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
        enableArcLabels
        arcLabel={(d) => `${Math.round(d.value)}%`}
        arcLabelsSkipAngle={16}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2.4]] }}
        enableArcLinkLabels
        arcLinkLabel={(d) => d.label}
        arcLinkLabelsSkipAngle={8}
        arcLinkLabelsTextOffset={6}
        arcLinkLabelsDiagonalLength={14}
        arcLinkLabelsStraightLength={20}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLinkLabelsTextColor="var(--tk-text-body)"
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          CenteredMetric,
        ]}
        tooltip={DonutTooltip}
        animate
        motionConfig="gentle"
      />
    </div>
  );
}
