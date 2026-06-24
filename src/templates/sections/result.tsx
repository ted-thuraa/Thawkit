"use client";

import React, { useEffect, useRef } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { usePersonalizationContext } from "@/hooks/usePersonalizationContext";
import {
  interpolateTemplate,
  isFullyResolved,
} from "@/lib/funnelPersonalisation/engine";
import {
  CalcResults,
  CalcVariable,
  CategoryScoreResult,
  LeadData,
  ResultOverviewSectionContent,
  ScoreTier,
} from "@/types/PageCMS/pageSchema";
import { PageSection } from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
};

type RenderContext = {
  leadData: LeadData;
  calc: CalcResults;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// NOTE ON THEMING: scoreColor() intentionally stays semantic (green/amber/red)
// rather than theme-accent-driven. It communicates score *quality*, not brand —
// recolouring a poor score with the operator's primary accent would remove a
// meaningful signal from the result page. Headings, body text, action buttons,
// and the welcome-message pill below all consume theme tokens as normal.
//
// This is intentionally independent of the ScoreTier system (tier.color)
// below — scoreColor()/scoreBand() drive the dial arc and bar fills with a
// fixed semantic palette, while ScoreTier drives the TierBadge labels with
// operator-configurable ranges/colors/labels. The two can diverge (e.g. an
// operator could legitimately set Tier 1's color to blue), which is expected:
// the tier badge always reflects the funnel's own configuration; the dial/bar
// color is a presentation-layer constant.
function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function scoreBand(score: number): { headline: string; detail: string } {
  if (score >= 80)
    return {
      headline: "Outstanding!",
      detail: "You're extremely well-aligned with your investment profile.",
    };
  if (score >= 60)
    return {
      headline: "Great fit!",
      detail:
        "You show solid alignment. A few refinements could sharpen your strategy.",
    };
  if (score >= 40)
    return {
      headline: "Good start",
      detail:
        "There's room to optimise. Consider reviewing your lower-scoring selections.",
    };
  return {
    headline: "Keep exploring",
    detail:
      "Your current choices diverge from the optimal path. Try retaking the quiz.",
  };
}

// ─── Tier badge — colored label per the funnel's configured score tiers ──────

/**
 * Renders the label of a resolved ScoreTier in that tier's own color.
 * Used for both the overall score (below ScoreDial) and each category score
 * (inside CategoryScoreBar). Renders nothing when no tier could be resolved
 * — e.g. a funnel authored with zero scoreTiers, or before any scoring pass
 * has run.
 *
 * Assumes `tier.color` is a 6-digit hex string (the format every other
 * color field in the schema, e.g. FunnelThemePalette, already requires) —
 * the alpha suffix appended below for the tint background relies on it.
 */
function TierBadge({ tier }: { tier: ScoreTier | null | undefined }) {
  if (!tier) return null;
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
      style={{
        color: tier.color,
        borderColor: tier.color,
        backgroundColor: `${tier.color}1A`, // ~10% alpha tint of the tier color
      }}
    >
      {tier.label}
    </span>
  );
}

// ─── Animated arc dial (overall score) ───────────────────────────────────────

function ScoreDial({ score }: { score: number }) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.strokeDashoffset = String(offset);
      });
    });
  }, [offset, circumference]);

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
      {/* Track */}
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="12"
      />
      {/* Progress arc — colour stays semantic (scoreColor), not theme-accent */}
      <circle
        ref={circleRef}
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform="rotate(-90 90 90)"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
      {/* Score label — themed text colours */}
      <text
        x="90"
        y="86"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="28"
        fontWeight="700"
        style={{ fill: "var(--tk-text-heading)" }}
      >
        {score}%
      </text>
      <text
        x="90"
        y="110"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        style={{ fill: "var(--tk-text-body)" }}
      >
        overall
      </text>
    </svg>
  );
}

// ─── Animated horizontal bar for a single category score ─────────────────────

function CategoryScoreBar({
  category,
  index,
}: {
  category: CategoryScoreResult;
  index: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const color = scoreColor(category.score);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Stagger each bar's entrance by its index
    const delay = 300 + index * 120;
    const timer = setTimeout(() => {
      bar.style.width = `${category.score}%`;
    }, delay);
    return () => clearTimeout(timer);
  }, [category.score, index]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header row: icon + title + score + tier */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none" aria-hidden="true">
            {category.categoryIcon}
          </span>
          <span
            className="text-sm font-semibold truncate"
            style={{ color: "var(--tk-text-heading)" }}
          >
            {category.categoryTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TierBadge tier={category.tier} />
          <span className="text-sm font-bold tabular-nums" style={{ color }}>
            {category.score}%
          </span>
        </div>
      </div>

      {/* Track + animated fill */}
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={category.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${category.categoryTitle}: ${category.score}%${
          category.tier ? ` (${category.tier.label})` : ""
        }`}
      >
        <div
          ref={barRef}
          className="absolute left-0 top-0 h-full w-0 rounded-full"
          style={{
            backgroundColor: color,
            transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>

      {/* Points detail */}
      <p
        className="text-xs"
        style={{ color: "var(--tk-text-body)", opacity: 0.8 }}
      >
        {category.earnedPoints} / {category.maxPoints} pts
      </p>
    </div>
  );
}

// ─── Category breakdown section ───────────────────────────────────────────────

function CategoryBreakdown({
  categories,
}: {
  categories: CategoryScoreResult[];
}) {
  if (categories.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-5">
      {/* Section divider + label */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--tk-text-body)", opacity: 0.7 }}
        >
          Category Breakdown
        </p>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      {/* One bar per category */}
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <CategoryScoreBar key={cat.categoryId} category={cat} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Calculated metrics panel ─────────────────────────────────────────────────

/**
 * CalcResultsPanel — renders a card grid of operator-defined calculated values.
 *
 * Only variables that:
 *   a) have a non-null resolved value, AND
 *   b) have `display.visible_on_result !== false`
 * ...are shown. This hides internal tier-classifier variables (which set
 * `visible_on_result: false`) while surfacing meaningful business metrics.
 *
 * The panel is a no-op when there are no calculations defined on the funnel
 * (zero regression for pre-calculation-engine funnels).
 */
function CalcResultsPanel({
  results,
  variables,
}: {
  results: CalcResults;
  variables: CalcVariable[];
}) {
  const visibleVars = variables.filter(
    (v) =>
      v.display.visible_on_result !== false &&
      results[v.id]?.value !== null &&
      results[v.id] !== undefined,
  );

  if (visibleVars.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--tk-text-body)", opacity: 0.7 }}
        >
          Your Estimates
        </p>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Metric cards — 2-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {visibleVars.map((v) => {
          const entry = results[v.id];
          return (
            <div
              key={v.id}
              className="rounded-2xl border border-gray-100 p-4 space-y-1"
              style={{ backgroundColor: "var(--tk-card-bg)" }}
            >
              <p
                className="text-xs leading-tight"
                style={{ color: "var(--tk-text-body)", opacity: 0.7 }}
              >
                {v.label}
              </p>
              <p
                className="text-lg font-bold tabular-nums leading-tight"
                style={{
                  color: "var(--tk-text-heading)",
                  fontFamily: "var(--tk-font-heading)",
                }}
              >
                {entry.formatted}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ResultPage({ section }: Props) {
  // Prefer the rich scoreResult; fall back to bare finalScore for backwards compat
  const scoreResult = useFunnelStore((s) => s.scoreResult);
  const finalScore = useFunnelStore((s) => s.finalScore);
  const calcResults = useFunnelStore((s) => s.calcResults);
  const initFunnel = useFunnelStore((s) => s.initFunnel);
  const schema = useFunnelStore((s) => s.schema);

  // Shared personalization context — same instance the new
  // DetailedCategoryResults section uses, built once per page render.
  const personalizationCtx = usePersonalizationContext();

  const content = section.content as ResultOverviewSectionContent;

  const overallScore = scoreResult?.overallScore ?? finalScore ?? 0;
  // Only available once a real scoreResult has been computed (resolveToResult);
  // the bare finalScore fallback above predates the tier system and carries
  // no tier info, so overallTier is simply absent in that legacy path.
  const overallTier = scoreResult?.overallTier ?? null;
  const categoryScores = scoreResult?.categoryScores ?? [];
  const { headline, detail } = scoreBand(overallScore);

  // CalcVariable definitions from the schema — used by CalcResultsPanel for
  // labels and visibility config. Falls back to empty array for funnels
  // without a calculations block.
  const calcVariables = schema?.calculations?.variables ?? [];
  // ── Build render context ──────────────────────────────────────────────────
  // Single context object shared by all template interpolation calls.
  // Adding a new namespace in future (e.g. "question", "global") requires
  // only extending this object and updating interpolateNamespacedTemplate.
  //const renderCtx: RenderContext = { leadData, calc: calcResults };

  // Convenience wrapper — interpolates any optional string field.
  // const render = (t?: string) =>
  //   t ? interpolateNamespacedTemplate(t, renderCtx) : undefined;

  // ── Welcome message interpolation ──────────────────────────────────────────
  // Interpolate against the shared personalization context (whose `lead`
  // field is the same leadData this previously read directly). Strict,
  // all-or-nothing gate preserved exactly: shows only when every token in
  // the template string resolved to a non-empty value.
  const welcomeMessage = (() => {
    if (!content.welcome_message) return null;
    const interpolated = interpolateTemplate(
      content.welcome_message,
      personalizationCtx,
    );
    return isFullyResolved(interpolated) ? interpolated : null;
  })();

  const handleRetake = () => {
    if (schema) initFunnel(schema);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 gap-10 text-center">
      {/* ── Personalised welcome (only rendered when lead data was captured) ── */}
      {welcomeMessage && (
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: "var(--tk-accent-primary-bg)",
            borderColor: "var(--tk-accent-primary-border)",
            color: "var(--tk-accent-primary)",
          }}
        >
          {welcomeMessage}
        </div>
      )}

      {/* ── Overall score dial + tier label ── */}
      <div className="flex flex-col items-center gap-3">
        <ScoreDial score={overallScore} />
        <TierBadge tier={overallTier} />
      </div>

      {/* ── Score band copy ── */}
      <div className="space-y-2 max-w-md">
        <p
          className="text-sm font-medium uppercase tracking-widest"
          style={{ color: "var(--tk-text-body)", opacity: 0.8 }}
        >
          {content.scoreLabel ?? "Your Readiness Score"}
        </p>
        <h1
          className="text-4xl"
          style={{
            color: "var(--tk-text-heading)",
            fontFamily: "var(--tk-font-heading)",
            fontWeight:
              "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
          }}
        >
          {headline}
        </h1>
        <p className="text-base" style={{ color: "var(--tk-text-body)" }}>
          {detail}
        </p>
      </div>

      {/* ── Per-category breakdown ── */}
      <CategoryBreakdown categories={categoryScores} />
      {/* ── Calculated business metrics panel ──
           Rendered only when the funnel has a `calculations` block with at
           least one successfully resolved, visible variable. */}
      <CalcResultsPanel results={calcResults} variables={calcVariables} />

      {/* ── Optional schema copy (heading / subtext) ── */}
      {(content.heading || content.subtext) && (
        <div className="max-w-md space-y-2 border-t border-gray-100 pt-8">
          {content.heading && (
            <h2
              className="text-xl"
              style={{
                color: "var(--tk-text-heading)",
                fontFamily: "var(--tk-font-heading)",
                fontWeight:
                  "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
              }}
            >
              {content.heading}
            </h2>
          )}
          {content.subtext && (
            <p className="text-sm" style={{ color: "var(--tk-text-body)" }}>
              {content.subtext}
            </p>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={handleRetake}
          className="flex-1 py-3 rounded-full border-2 font-semibold
                     transition-colors duration-150 hover:brightness-95"
          style={{
            borderColor: "var(--tk-accent-secondary)",
            color: "var(--tk-accent-secondary)",
          }}
        >
          {content.retakeCta?.label ?? "Retake Quiz"}
        </button>
        <button
          className="flex-1 py-3 rounded-full font-semibold
                     hover:brightness-90 active:scale-95 transition-all duration-200"
          style={{
            backgroundColor: "var(--tk-accent-primary)",
            color: "var(--tk-accent-primary-fg)",
            boxShadow: "0 10px 25px -8px var(--tk-accent-primary-border)",
          }}
        >
          Get My Plan
        </button>
      </div>
    </div>
  );
}
