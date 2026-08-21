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
import { ScoreDonutChart } from "../../TemplateComponents/Charts/ScoreDonutChart";
import Image from "next/image";
import GaugeChart from "../components/charts/gaugeChart";
import FunnelResultScoreGaugeChart from "../components/charts/gaugeChart";
import {
  FunnelButton,
  FunnelButtonContainer,
} from "../components/FunnelButton";

type Props = {
  section: PageSection;
  pageId: string;
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

export function ResultPage({ section, pageId }: Props) {
  // Prefer the rich scoreResult; fall back to bare finalScore for backwards compat
  const scoreResult = useFunnelStore((s) => s.scoreResult);
  const finalScore = useFunnelStore((s) => s.finalScore);
  const calcResults = useFunnelStore((s) => s.calcResults);
  const initFunnel = useFunnelStore((s) => s.initFunnel);
  const schema = useFunnelStore((s) => s.schema);
  const retakeFunnel = useFunnelStore((s) => s.retakeFunnel);

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
    retakeFunnel();
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
        to do pie chart
        {/* <ScoreDonutChart
          categories={categoryScores}
          overallScore={overallScore}
          overallTier={overallTier}
        /> */}
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
              {interpolateTemplate(content.heading, personalizationCtx)}
            </h2>
          )}
          {content.subtext && (
            <p className="text-sm" style={{ color: "var(--tk-text-body)" }}>
              {interpolateTemplate(content.subtext, personalizationCtx)}
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

export function ResultSection_v1({ section, pageId }: Props) {
  // Prefer the rich scoreResult; fall back to bare finalScore for backwards compat
  const scoreResult = useFunnelStore((s) => s.scoreResult);
  const finalScore = useFunnelStore((s) => s.finalScore);
  const schema = useFunnelStore((s) => s.schema);
  const retakeFunnel = useFunnelStore((s) => s.retakeFunnel);

  // Shared personalization context — same instance the
  // DetailedCategoryResults section uses, built once per page render.
  const personalizationCtx = usePersonalizationContext();

  const content = section.content as ResultOverviewSectionContent;

  const overallScore = scoreResult?.overallScore ?? finalScore ?? 0;

  // ── Gauge arc bands ─────────────────────────────────────────────────────
  // Derived from the funnel's own configured score tiers (or the shared
  // DEFAULT_SCORE_TIERS fallback) so the gauge's color bands always match
  // the same tier ladder driving TierBadge/CategoryScoreBar elsewhere on
  // this page — single source of truth, no hardcoded thresholds here.
  const scoreTiers = schema?.scoreTiers ?? [];
  const gaugeArcsData = [...scoreTiers]
    .sort((a, b) => a.score_to - b.score_to)
    .map((tier, i, arr) => ({
      limit: tier.score_to,
      color: tier.color,
      showTick: i === arr.length - 1,
      label: tier.label,
    }));

  // ── Welcome message interpolation ──────────────────────────────────────
  const welcomeMessage = (() => {
    if (!content.welcome_message) return null;
    const interpolated = interpolateTemplate(
      content.welcome_message,
      personalizationCtx,
    );
    return isFullyResolved(interpolated) ? interpolated : null;
  })();

  const handleRetake = () => {
    retakeFunnel();
  };

  return (
    <section id="result-gauge" className="grid grid-cols-1 items-center">
      <div className="mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276 p-[0.5px]">
        <div className="*:p-[0.5px]  relative">
          <div className="relative grid gap-px overflow-hidden">
            {(content.heading || content.subtext) && (
              <div
                className="relative z-10 p-6 @4xl:px-8 @4xl:pt-20 @4xl:pb-14"
                data-grid-content="true"
              >
                <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground mb-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-muted-foreground/50"
                  >
                    [
                  </span>
                  agentic shopping
                  <span
                    aria-hidden="true"
                    className="font-mono text-muted-foreground/50"
                  >
                    ]
                  </span>
                </p>
                <h2
                  className="mb-4 max-w-3xl text-pretty font-medium text-2xl leading-tight lg:text-4xl "
                  style={{
                    color: "var(--tk-text-heading)",
                    fontFamily: "var(--tk-font-heading)",
                    fontWeight:
                      "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
                  }}
                >
                  {interpolateTemplate(content.heading, personalizationCtx)}
                </h2>
                {content.subtext && (
                  <p
                    className="max-w-3xl text-pretty font-normal text-base  lg:text-lg "
                    style={{ color: "var(--tk-text-body)" }}
                  >
                    {interpolateTemplate(content.subtext, personalizationCtx)}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3  gap-px ">
            {/* ── Gauge visual (replaces static image placeholder) ── */}
            <div className="md:col-span-2">
              <div
                className="h-full w-full flex items-center justify-center  @4xl:p-6 p-4"
                data-grid-content="true"
              >
                <div className="w-full aspect-[2/1] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                  <FunnelResultScoreGaugeChart
                    gaugeType="semicircle-default"
                    overallScoreData={{
                      score_percentage: String(overallScore),
                    }}
                    arcsData={gaugeArcsData}
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="grid h-full gap-px">
                <div className=" @4xl:p-6 p-4" data-grid-content="true">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="mt-0.5 size-5 text-gray-600"
                    >
                      <path
                        d="M104,168a40,40,0,1,1-40-40A40,40,0,0,1,104,168Zm88-40a40,40,0,1,0,40,40A40,40,0,0,0,192,128Z"
                        opacity="0.2"
                      ></path>
                      <path d="M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"></path>
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Visibility Score
                      </h4>
                      <p className="mt-1 text-gray-600 text-sm">
                        Track responses and ensure your AI outputs are easily
                        understood.
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" @4xl:p-6 p-4" data-grid-content="true">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="mt-0.5 size-5 text-gray-600"
                    >
                      <path
                        d="M216,48v55.77C216,174.6,176.6,232,128,232S40,174.6,40,103.79V48a8,8,0,0,1,10.89-7.47C66,46.41,95.11,55.71,128,55.71s62-9.3,77.11-15.16A8,8,0,0,1,216,48Z"
                        opacity="0.2"
                      ></path>
                      <path d="M217,34.8a15.94,15.94,0,0,0-14.82-1.71C188.15,38.55,159.82,47.71,128,47.71S67.84,38.55,53.79,33.09A16,16,0,0,0,32,48v55.77c0,35.84,9.65,69.65,27.18,95.18,18.16,26.46,42.6,41,68.82,41s50.66-14.57,68.82-41C214.35,173.44,224,139.63,224,103.79V48A16,16,0,0,0,217,34.8Zm-9,69c0,32.64-8.66,63.23-24.37,86.13C168.54,211.9,148.79,224,128,224s-40.54-12.1-55.63-34.08C56.66,167,48,136.43,48,103.79V48c15.11,5.87,45.58,15.71,80,15.71S192.9,53.87,208,48v55.81Zm-18,18.87A8,8,0,1,1,178,133.33c-2.68-3-8.85-5.33-14-5.33s-11.36,2.34-14,5.33A8,8,0,1,1,138,122.66c5.71-6.38,16.14-10.66,26-10.66S184.25,116.28,190,122.66ZM92,128c-5.19,0-11.36,2.34-14,5.33A8,8,0,1,1,66,122.66C71.75,116.28,82.18,112,92,112s20.25,4.28,26,10.66A8,8,0,1,1,106,133.33C103.36,130.34,97.19,128,92,128Zm76.45,45.19a52.9,52.9,0,0,1-80.9,0A8,8,0,1,1,99.72,162.8a36.89,36.89,0,0,0,56.56,0,8,8,0,0,1,12.17,10.39Z"></path>
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Sentiment Analysis
                      </h4>
                      <p className="mt-1 text-gray-600 text-sm">
                        Monitor how responses resonate through emotional tone
                        and user satisfaction.
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" @4xl:p-6 p-4" data-grid-content="true">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="mt-0.5 size-5 text-gray-600"
                    >
                      <path
                        d="M224,64l-12.16,66.86A16,16,0,0,1,196.1,144H70.55L56,64Z"
                        opacity="0.2"
                      ></path>
                      <path d="M230.14,58.87A8,8,0,0,0,224,56H62.68L56.6,22.57A8,8,0,0,0,48.73,16H24a8,8,0,0,0,0,16h18L67.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,160,204a28,28,0,1,0,28-28H91.17a8,8,0,0,1-7.87-6.57L80.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,230.14,58.87ZM104,204a12,12,0,1,1-12-12A12,12,0,0,1,104,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,200,204Zm4-74.57A8,8,0,0,1,196.1,136H77.22L65.59,72H214.41Z"></path>
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Shopping Data
                      </h4>
                      <p className="mt-1 text-gray-600 text-sm">
                        See when ChatGPT is recommending your brand in the
                        future of shopping.
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" @4xl:p-6 p-4" data-grid-content="true">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="mt-0.5 size-5 text-gray-600"
                    >
                      <path
                        d="M224,80l-96,56L32,80l96-56Z"
                        opacity="0.2"
                      ></path>
                      <path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path>
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Entity Tracker
                      </h4>
                      <p className="mt-1 text-gray-600 text-sm">
                        Identify and track brands, products, and competitors
                        mentioned in AI responses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FunnelButtonContainer
            layout="inline"
            justify="start"
            gap="md"
            className="w-full justify-center items-center"
          >
            <FunnelButton
              variant="unstyled"
              size="none"
              analyticsId={`${pageId}-result-retake-cta`}
              onClick={handleRetake}
              aria-label={content.retakeCta?.label ?? "Retake Quiz"}
              className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.99] active:transition-none h-9 px-4 py-2 text-base border border-transparent shadow-black/15 shadow-sm ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 w-full gap-2 bg-white pr-3.5 pl-5 sm:w-auto"
              style={{
                backgroundColor: "var(--tk-accent-primary)",
                color: "var(--tk-accent-primary-fg)",
                boxShadow: "0 10px 25px -8px var(--tk-accent-primary-border)",
              }}
            >
              {content.retakeCta?.label ?? "Retake Quiz"}
            </FunnelButton>
          </FunnelButtonContainer>
        </div>
      </div>
    </section>
  );
}
