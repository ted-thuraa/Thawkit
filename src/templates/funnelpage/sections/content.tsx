"use client";

import React, { useMemo } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { resolveDynamicContent } from "@/stores/funnelStore/helpers";
import {
  ContentSection,
  PageSection,
  PageType,
} from "@/types/PageCMS/pageSchema";
import { FunnelSection } from "../components/FunnelSection";

type Props = {
  section: PageSection;
  pageId: string;
  /**
   * The pageType of the page this section instance is currently rendering
   * on — passed down from funnelContainer.tsx via SectionTypeRenderer. This
   * is what lets the component decide, without touching the store at all,
   * whether dynamic-content resolution is even reachable for this instance.
   */
  pageType: PageType;
};

// The subset of ContentSection that participates in tier-based variation.
type ContentTextFields = Pick<
  ContentSection,
  "heading" | "subtext" | "eyebrow"
>;

// ─── Pure presentational layout ────────────────────────────────────────────
//
// No store access, no dynamic-content logic, no knowledge of scoring at
// all. Shared by both the static and dynamic render paths below so there is
// exactly one place that owns this template's actual markup — resolving a
// variant never means maintaining two copies of the JSX.
function ContentBlockLayout({
  pageId,
  fields,
}: {
  pageId: string;
  fields: ContentTextFields;
}) {
  return (
    <FunnelSection
      as="section"
      id="home" // preserved as a real anchor id — not replaced by stepId
      stepId={`${pageId}-content-leftalligned`}
      maxWidth="full"
      padding="none"
      gap="none"
      align="start"
      className="grid grid-cols-1 items-center"
    >
      <div className="">
        <div className="*:p-[0.5px] relative">
          <div className="grid gap-px">
            <div className="relative overflow-hidden" data-grid-content="true">
              <div className="relative z-10 @4xl:px-8 px-6 @4xl:pt-14 pt-8 @4xl:pb-40 pb-28">
                {fields.eyebrow && (
                  <p className="inline-flex items-center gap-px text-xs tracking-widest text-muted-foreground mb-4">
                    <span
                      aria-hidden="true"
                      className="font-mono text-muted-foreground/50"
                    >
                      [
                    </span>
                    {fields.eyebrow}
                    <span
                      aria-hidden="true"
                      className="font-mono text-muted-foreground/50"
                    >
                      ]
                    </span>
                  </p>
                )}
                <h2 className="mb-4 max-w-3xl text-pretty font-medium text-2xl text-foreground leading-tight lg:text-4xl">
                  {fields.heading}
                </h2>
                {fields.subtext && (
                  <p className="max-w-xl text-pretty font-normal text-base text-muted-foreground lg:text-lg">
                    {fields.subtext}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FunnelSection>
  );
}

// ─── Dynamic path — the ONLY place scoreResult is touched ──────────────────
//
// Isolated into its own component on purpose: the useFunnelStore(scoreResult)
// subscription and the resolveDynamicContent() call physically live only
// here. As long as the parent below never mounts this component, React never
// registers a subscription to score state for this section instance — not
// "returns early," not "no-ops," genuinely never subscribed. That's what
// makes a landing-page instance of this template fully inert to every score
// computation that happens later in the funnel (resolveToResult(), retake,
// etc. never trigger a re-render here).
function DynamicContentBlock({
  pageId,
  base,
  dynamicContent,
}: {
  pageId: string;
  base: ContentTextFields;
  dynamicContent: NonNullable<ContentSection["dynamicContent"]>;
}) {
  const scoreResult = useFunnelStore((s) => s.scoreResult);

  const resolved = useMemo(
    () =>
      resolveDynamicContent<ContentTextFields>(
        base,
        dynamicContent,
        scoreResult,
      ),
    [base, dynamicContent, scoreResult],
  );

  return <ContentBlockLayout pageId={pageId} fields={resolved} />;
}

/**
 * ContentLeftAlligned_v1 — template_id "CONTENT_LEFT_ALLIGNED_v1"
 *
 * A left-aligned eyebrow/heading/subtext content block. Reusable on ANY
 * page — landing, normal, or result — since it carries no assumptions about
 * where it's placed.
 *
 * ── Efficiency contract ──────────────────────────────────────────────────
 * Dynamic content (score-tier variant swapping) only ever has meaning on
 * the result page — a FunnelScoreResult doesn't exist until after
 * submission. This component performs one cheap, purely-local check —
 * `pageType === "result_page" && content.dynamicContent?.isDynamic` —
 * BEFORE deciding which child to mount:
 *
 *   - Gate false  (any non-result page, OR a result-page section with
 *     dynamic content switched off) → renders ContentBlockLayout directly.
 *     No store subscription of any kind is created for this instance.
 *   - Gate true   → mounts DynamicContentBlock, which is the only place
 *     scoreResult is read and resolveDynamicContent() is called.
 *
 * The same template_id can therefore appear on the landing page, a
 * mid-funnel page, AND the result page in the same schema — only the
 * result-page instance(s) with isDynamic:true ever pay for tier resolution.
 */
export const ContentLeftAlligned_v1 = ({
  section,
  pageId,
  pageType,
}: Props) => {
  const content = section.content as ContentSection;

  // Memoized so DynamicContentBlock's own useMemo (keyed on this object by
  // reference) only invalidates when a field's actual value changes, not on
  // every parent re-render.
  const base: ContentTextFields = useMemo(
    () => ({
      heading: content.heading,
      subtext: content.subtext,
      eyebrow: content.eyebrow,
    }),
    [content.heading, content.subtext, content.eyebrow],
  );

  const isDynamicEligible =
    pageType === "result_page" && content.dynamicContent?.isDynamic === true;

  if (!isDynamicEligible) {
    return <ContentBlockLayout pageId={pageId} fields={base} />;
  }

  return (
    <DynamicContentBlock
      pageId={pageId}
      base={base}
      dynamicContent={content.dynamicContent!}
    />
  );
};
