"use client";

import React, { useMemo } from "react";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { resolveBracket } from "@/stores/funnelStore/helpers";
import { MiniResult1Content, PageSection } from "@/types/PageCMS/pageSchema";

type Props = {
  section: PageSection;
  pageId: string;
};

/**
 * MiniResult1 — a progressive, in-funnel result snippet.
 *
 * Unlike the final ResultPage (result.tsx), this section renders WHILE the
 * respondent is still mid-funnel. Its content is resolved from a partial
 * score/answer snapshot — only the questions the respondent has actually
 * answered so far — via the store's partialScoreUpTo(section.order).
 *
 * Content authoring model: `content.brackets` is a priority-ordered list of
 * conditional variants (see ScoreBracketContent in pageSchema.ts). The first
 * bracket whose predicate matches wins; a bracket with no predicate acts as
 * the fallback. resolveBracket() — a pure, store-free function shared with
 * the branch-rule evaluator — performs this resolution.
 *
 * Navigation: forward movement is owned by the page-level PageProceedButton
 * in funnelContainer.tsx (the same "lifted nav bar" pattern used for quiz
 * pages). Back navigation is owned locally here, mirroring QuizShell's back
 * button in quiz.tsx, since a mini-result page may contain no quiz section
 * for funnelContainer's quiz-detection logic to key off of.
 */
export const MiniResult1 = ({ section }: Props) => {
  const content = section.content as MiniResult1Content;

  const answers = useFunnelStore((s) => s.answers);
  const partialScoreUpTo = useFunnelStore((s) => s.partialScoreUpTo);
  const prevStep = useFunnelStore((s) => s.prevStep);

  // partialScoreUpTo() is a plain function, not a subscribed selector — the
  // component subscribes to `answers` itself so it knows when to recompute.
  // Memoised so an unrelated re-render (e.g. a sibling section's local
  // state) doesn't redo the scoring pass.
  const partialScore = useMemo(
    () => partialScoreUpTo(section.order),
    [partialScoreUpTo, section.order, answers],
  );

  const bracket = useMemo(
    () => resolveBracket(content.brackets ?? [], answers, partialScore),
    [content.brackets, answers, partialScore],
  );

  if (!bracket) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `[MiniResult1] section "${section.id}" has no matching bracket and ` +
          `no fallback (predicate-less) bracket defined — nothing to render. ` +
          `Add a bracket without a \`predicate\` to guarantee a default.`,
      );
    }
    return null;
  }

  return (
    <section className="w-full flex flex-col items-center py-16 px-4 gap-8 animate-fadeIn">
      {/* ── Back button — mirrors QuizShell's, since this page may have no quiz section ── */}
      <div className="w-full max-w-2xl">
        <button
          onClick={prevStep}
          aria-label="Go back"
          className="flex items-center gap-2 text-sm font-medium text-gray-500
                     hover:text-[var(--tk-text-link)] transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {content.goBack_cta?.label ?? "Back"}
        </button>
      </div>

      {/* ── Dynamic content card ── */}
      <div
        className="w-full max-w-2xl rounded-[2rem] border p-10 md:p-12 text-center space-y-4"
        style={{
          backgroundColor: "var(--tk-card-bg)",
          borderColor: "var(--tk-accent-primary-border)",
        }}
      >
        {content.eyebrow && (
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--tk-text-body)", opacity: 0.7 }}
          >
            {content.eyebrow}
          </p>
        )}

        {bracket.icon && (
          <span className="block text-4xl leading-none" aria-hidden="true">
            {bracket.icon}
          </span>
        )}

        <h2
          className="text-2xl md:text-3xl leading-tight"
          style={{
            color: "var(--tk-text-heading)",
            fontFamily: "var(--tk-font-heading)",
            fontWeight:
              "var(--tk-font-heading-weight)" as React.CSSProperties["fontWeight"],
          }}
        >
          {bracket.heading}
        </h2>

        {bracket.subtext && (
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--tk-text-body)" }}
          >
            {bracket.subtext}
          </p>
        )}
      </div>
    </section>
  );
};
