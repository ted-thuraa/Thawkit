// components/FunnelContainer.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useSoftRouter } from "@/hooks/useSoftRouter";
import { useFunnelStore } from "@/stores/funnelStore/store";
import { funnelPayload } from "@/dummyData/pageData";
import SectionTypeRenderer from "./sectionRenderer";
import { LeadFormPage } from "./leadform";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import {
  MiniResultSectionContent,
  QuizSectionContent,
} from "@/types/PageCMS/pageSchema";

// ─── PageProceedButton ────────────────────────────────────────────────────────

/**
 * The single proceed/submit control for an entire normal_page.
 *
 * Lives at the page level (not inside any quiz or mini-result section) so it
 * activates only after ALL quiz sections on the page have valid answers.
 * This enforces the requirement that users view and answer every section
 * before advancing, regardless of how many quiz, mini-result, testimonial,
 * hero, or other sections a page contains.
 *
 * Label resolution (in priority order):
 *  1. Last quiz section's goForward_cta.label from the schema.
 *  2. Last mini-result section's goForward_cta.label from the schema.
 *  3. "See My Results" when on the final funnel step.
 *  4. "Proceed" as the universal fallback.
 */
function PageProceedButton({
  canProceed,
  isLast,
  isCalculating,
  label,
  onNext,
  onSubmit,
}: {
  canProceed: boolean;
  isLast: boolean;
  isCalculating: boolean;
  label: string;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const enabled = canProceed && !isCalculating;

  return (
    <div className="flex justify-center px-4 pb-16 pt-4">
      <button
        onClick={isLast ? onSubmit : onNext}
        disabled={!enabled}
        aria-disabled={!enabled}
        className={`
        w-full max-w-2xl py-4 rounded-full font-semibold text-base
        transition-all duration-200 flex items-center justify-center gap-2
        ${
          enabled
            ? "hover:brightness-90 active:scale-95"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }
      `}
        style={
          enabled
            ? {
                backgroundColor: "var(--tk-accent-primary)",
                color: "var(--tk-accent-primary-fg)",
                boxShadow: "0 10px 25px -8px var(--tk-accent-primary-border)",
              }
            : undefined
        }
      >
        {isCalculating ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Calculating your score…
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

// ─── FunnelContainer ──────────────────────────────────────────────────────────

/**
 * FunnelContainer — The Single-Page Application shell.
 *
 * Responsibilities:
 *  1. Initialises the Zustand store with the full funnel schema (runs once).
 *  2. Activates the soft-routing hook to keep URL ↔ state in sync.
 *  3. Reads the current active page from the store and renders its sections.
 *  4. Owns page-level forward navigation via PageProceedButton, which
 *     activates only when every quiz section on the page has a valid answer
 *     (mini-result-only pages require no answer, so they're always
 *     proceed-able as soon as they're reached).
 *
 * Navigation ownership:
 *  - Back navigation    → contextual per section: QuizShell (quiz.tsx) for
 *                          quiz sections, MiniResult1's own back control for
 *                          mini-result sections.
 *  - Forward navigation → PageProceedButton (here), enforces full-page
 *                          completion. This is the "Lifted Page-Level
 *                          Navigation Bar" pattern — see architecture notes.
 */
export function FunnelContainer() {
  const initFunnel = useFunnelStore((s) => s.initFunnel);
  const isReady = useFunnelStore((s) => s.isReady);
  const currentPageId = useFunnelStore((s) => s.currentPageId);
  const isOnResultPage = useFunnelStore((s) => s.isOnResultPage);
  const currentPage = useFunnelStore((s) => s.currentPage);
  const progressPercent = useFunnelStore((s) => s.progressPercent);
  const totalSteps = useFunnelStore((s) => s.totalSteps);
  const navigationHistory = useFunnelStore((s) => s.navigationHistory);
  const isOnLeadForm = useFunnelStore((s) => s.isOnLeadForm);

  // ── Navigation actions (owned here, not in quiz sections) ──────────────────
  const answers = useFunnelStore((s) => s.answers);
  const nextStep = useFunnelStore((s) => s.nextStep);
  const submitFunnel = useFunnelStore((s) => s.submitFunnel);
  const isLastStep = useFunnelStore((s) => s.isLastStep);
  const isCalculating = useFunnelStore((s) => s.isCalculating);

  // ── 1. Hydrate the store with the pre-loaded schema ────────────────────────
  useEffect(() => {
    if (!isReady) {
      initFunnel(funnelPayload);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Keep URL in sync with store step ────────────────────────────────────
  useSoftRouter();

  // ── Hooks that must run unconditionally — before any early returns ─────────
  //
  // React requires every hook to be called on every render, in the same order.
  // currentPage() is a plain function (not a hook), but the useMemo calls
  // below ARE hooks. They must execute before the isReady / isOnLeadForm /
  // !activePage early returns, otherwise flipping isOnLeadForm=true causes a
  // "rendered fewer hooks than expected" crash on the very next render.
  //
  // All memos handle a null activePage safely via the `?? []` / `true`
  // fallbacks — they become cheap no-ops on those early-exit renders.
  const activePage = currentPage();

  const quizSections = useMemo(
    () => activePage?.sections.filter((s) => s.type === "quiz") ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activePage?.id],
  );

  const miniResultSections = useMemo(
    () => activePage?.sections.filter((s) => s.type === "mini_result") ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activePage?.id],
  );

  const canProceed = useMemo(() => {
    // Mini-result sections require no answer — they're purely informational,
    // so they never gate canProceed. Only quiz sections do.
    if (quizSections.length === 0) return true;
    return quizSections.every((s) => {
      const content = s.content as QuizSectionContent;
      if (content.questionType === "scale") return true;
      const ans = answers[s.id];
      if (Array.isArray(ans)) return ans.length > 0;
      if (typeof ans === "string") return ans.trim().length > 0;
      return ans !== undefined && ans !== null;
    });
  }, [quizSections, answers]);

  // ── Early returns (all hooks already called above) ─────────────────────────

  // ── 3. Guard until schema is loaded ───────────────────────────────────────
  if (!isReady) {
    return (
      <ThemeProvider>
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "var(--tk-accent-primary)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      </ThemeProvider>
    );
  }

  // ── 4. Lead form intercept ─────────────────────────────────────────────────
  // Rendered between the last quiz step and the result page.
  // No progress bar — this is a transient intercept, not a scored step.
  if (isOnLeadForm) {
    return (
      <ThemeProvider>
        <main key="lead-form" className="max-w-7xl mx-auto px-6 animate-fadeIn">
          <LeadFormPage />
        </main>
      </ThemeProvider>
    );
  }

  if (!activePage) return null;

  // Progress is a property of the page's ROLE (an intermediate funnel step),
  // not of whether the page happens to contain a quiz section.
  const isNormalPage = activePage.pageType === "normal_page";
  const progress = progressPercent();
  const steps = totalSteps();

  // Read the proceed label from the last quiz/mini-result section's CTA
  // config so schema authors can customise it per page without touching
  // component code.
  const isLast = isLastStep();
  const lastQuizContent = quizSections.at(-1)?.content as
    | QuizSectionContent
    | undefined;
  const lastMiniResultContent = miniResultSections.at(-1)?.content as
    | MiniResultSectionContent
    | undefined;
  const proceedLabel =
    lastQuizContent?.goForward_cta?.label ??
    lastMiniResultContent?.goForward_cta?.label ??
    (isLast ? "See My Results" : "Proceed");

  return (
    <ThemeProvider>
      {/* ── Progress bar (only visible on normal/intermediate-step pages) ── */}
      {isNormalPage && (
        <div
          className="fixed top-0 left-0 right-0 z-50"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${navigationHistory.length} of ${steps - 1}`}
        >
          <div
            className="h-1"
            style={{ backgroundColor: "var(--tk-accent-primary-bg)" }}
          >
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--tk-accent-primary)",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Page sections ── */}
      <main
        key={activePage.id} // Forces re-mount animation on page change
        className="max-w-7xl mx-auto px-6 space-y-24 pt-20 animate-fadeIn"
      >
        {activePage.sections.map((section) => (
          <SectionTypeRenderer
            key={section.id}
            section={section}
            pageId={activePage.id}
            pageType={activePage.pageType}
          />
        ))}
      </main>

      {/* ── Page-level proceed button ── */}
      {/* Shown on intermediate steps that contain at least one quiz or
          mini-result section — the "Lifted Page-Level Navigation Bar"
          pattern. Pages with neither (e.g. pure hero+features+cta landing
          pages) rely on their own section-level CTAs instead (e.g.
          hero.tsx's primary_cta → nextStep). */}
      {isNormalPage &&
        (quizSections.length > 0 || miniResultSections.length > 0) && (
          <PageProceedButton
            canProceed={canProceed}
            isLast={isLast}
            isCalculating={isCalculating}
            label={proceedLabel}
            onNext={nextStep}
            onSubmit={submitFunnel}
          />
        )}
    </ThemeProvider>
  );
}
