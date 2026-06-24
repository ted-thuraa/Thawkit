// src/components/funnel/sectionRenderer.tsx
"use client";

/**
 * SectionTypeRenderer — the single dispatch point between a `PageSection`
 * JSON descriptor and the React component that renders it.
 *
 * ── Dispatch strategy ─────────────────────────────────────────────────────────
 *
 * We switch on `section.template_id` (the discriminant of the `SectionDefinition`
 * union), NOT on `section.type`.
 *
 * Why `template_id` instead of `type`?
 *
 *   1. TypeScript narrows `section.content` correctly inside each `case` when
 *      switching on the discriminant. Switching on `section.type` gives NO
 *      narrowing of `content` because `type` is not part of the discriminated
 *      union — it's just a string field on the shared metadata wrapper.
 *
 *   2. `template_id` is fully unique per visual variant.  `section.type`
 *      groups multiple variants together (e.g. both FAQ templates share
 *      `type: "faq"`), which forced the original two-level switch.
 *
 *   3. The flat single switch enables a compile-time exhaustiveness check via
 *      `assertNever` in the `default` branch. If a new `template_id` is added
 *      to `SectionDefinition` in `pageSchema.ts` but no `case` is added here,
 *      the TypeScript compiler produces an error at the `assertNever` call —
 *      turning a previously-silent visual regression into a build failure.
 *
 * ── Adding a new template ─────────────────────────────────────────────────────
 *
 *   1. Add a new union member to `SectionDefinition` in pageSchema.ts
 *      (new `template_id` literal + matching content interface).
 *   2. Create the React component file (e.g. src/templates/sections/hero/HeroCentered.tsx).
 *   3. Import the component here and add a `case` for the new `template_id`.
 *
 * Forgetting step 3 is now a compile error, not a silent blank section.
 *
 * ── Template ID naming convention ─────────────────────────────────────────────
 *
 *   {CATEGORY}__{LAYOUT_VARIANT}__{STYLE_VARIANT}__{VERSION}
 *
 * See src/lib/template-id.ts for the full specification.
 */

import React from "react";

import { PageSection } from "@/types/PageCMS/pageSchema";

// Section component imports — one per template_id.
// Grouped by category to mirror the SectionDefinition union structure.
import { Navbar1 } from "@/templates/sections/nav";
import { Hero1 } from "@/templates/sections/hero";
import { Stats1 } from "@/templates/sections/stats";
import { Features1 } from "@/templates/sections/features";
import { Faq1 } from "@/templates/sections/faq";
import { Cta1 } from "@/templates/sections/cta";
import { Quiz1 } from "@/templates/sections/quiz";
import { ResultPage } from "@/templates/sections/result";
import { assertNever } from "@/lib/utils/exhaustive";
import { MiniResult1 } from "@/templates/sections/miniResults";
import { DetailedCategoryResults } from "@/templates/sections/detailedCategoryResults";

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  section: PageSection;
  pageId: string;
};

// ─── Renderer ─────────────────────────────────────────────────────────────────

/**
 * Maps a `PageSection` descriptor to its React component.
 *
 * The switch exhausts every member of `SectionDefinition`. Adding a new
 * `template_id` to the union in pageSchema.ts without adding a `case` here
 * causes a TypeScript compile error at the `assertNever` call in `default`.
 */
const SectionTypeRenderer = ({
  section,
  pageId,
}: Props): React.ReactElement | null => {
  switch (section.template_id) {
    // ── HEADER ───────────────────────────────────────────────────────────────
    case "HEADER__STICKY_TOP__LIGHT__v1_0":
      // The nav is intentionally rendered at the layout level (funnelContainer
      // or a layout.tsx wrapper) rather than through the section pipeline for
      // landing pages. Quiz and result pages do not include a nav section in
      // their schemas. This case exists only to satisfy exhaustiveness — if a
      // future schema includes a nav section on a non-landing page, wire it
      // here by uncommenting the line below.
      //
      // return <Navbar1 section={section} pageId={pageId} />;
      return null;

    // ── HERO ─────────────────────────────────────────────────────────────────
    case "HERO__SPLIT_LEFT__LIGHT__v1_0":
      // Two-column layout: text left, image right.
      return <Hero1 section={section} pageId={pageId} />;

    case "HERO__CENTERED__LIGHT__v1_0":
      // TODO: HeroCentered component not yet implemented.
      // Create src/templates/sections/hero/HeroCentered.tsx, then replace
      // this null with: return <HeroCentered section={section} pageId={pageId} />;
      return null;

    // ── STATS ─────────────────────────────────────────────────────────────────
    case "STATS__GRID_4COL__LIGHT__v1_0":
      return <Stats1 section={section} />;

    // ── FEATURES ──────────────────────────────────────────────────────────────
    case "FEATURES__CARD_GRID__LIGHT__v1_0":
      return <Features1 section={section} />;

    // ── FAQ ───────────────────────────────────────────────────────────────────
    case "FAQ__SPLIT_LEFT__LIGHT__v1_0":
      // Two-column: heading + subtext + optional CTA (left), accordion (right).
      return <Faq1 section={section} />;

    case "FAQ__CENTERED__LIGHT__v1_0":
      // TODO: Faq2 (centered card accordion) component not yet implemented.
      // Create src/templates/sections/faq/FaqCentered.tsx, then replace
      // this null with: return <Faq2 section={section} />;
      return null;

    // ── CTA ───────────────────────────────────────────────────────────────────
    case "CTA__SPLIT_RIGHT__DARK__v1_0":
      // Dark card: descriptive text left, email subscribe form right.
      return <Cta1 section={section} />;

    // ── QUIZ ──────────────────────────────────────────────────────────────────
    case "QUIZ__SINGLE_STEP__LIGHT__v1_0":
      // Single-question step with forward/back navigation and branch support.
      return <Quiz1 section={section} pageId={pageId} />;
    // ── QUIZ ──────────────────────────────────────────────────────────────────
    case "MINIRESULT__SINGLE_STEP__LIGHT__v1_0":
      // Single-question step with forward/back navigation and branch support.
      return <MiniResult1 section={section} pageId={pageId} />;

    // ── RESULT ────────────────────────────────────────────────────────────────
    case "RESULT__SCORE_BREAKDOWN__LIGHT__v1_0":
      // Overall score + per-category breakdown + personalised CTAs.
      return <ResultPage section={section} />;
    // ── DETAILED CATEGORY RESULTS ───────────────────────────────────────────
    case "DETAILEDCATEGORYRESULTS__CARD_GRID__LIGHT__v1_0":
      // One personalized content card per funnel category.
      return <DetailedCategoryResults section={section} />;

    // ── Exhaustiveness guard ──────────────────────────────────────────────────
    // If `section.template_id` is `never` here, all union members are handled.
    // If it is NOT `never`, TypeScript produces a compile error at this line,
    // identifying exactly which template_id is missing a case above.
    default:
      return assertNever(section, "SectionTypeRenderer");
  }
};

export default SectionTypeRenderer;
