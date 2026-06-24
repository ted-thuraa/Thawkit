// store/useFunnelStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  FunnelAnswers,
  funnelPayloadSchema,
  FunnelScoreResult,
  PagePayloadSchema,
  Quiz1Content,
  QuizAnswer,
  LeadData,
  CalcResults,
} from "@/types/PageCMS/pageSchema";
import {
  computeFunnelScore,
  evaluateBranchPredicate,
  EMPTY_FUNNEL_SCORE_RESULT,
  DEFAULT_SCORE_TIERS,
  calculateVariables,
} from "./helpers";
import {
  loadProgress,
  saveProgress,
  clearProgress,
} from "@/utils/funnelProgress";

// ─── State Shape ──────────────────────────────────────────────────────────────

type FunnelState = {
  /** The entire pre-loaded funnel schema — set once on initialization */
  schema: funnelPayloadSchema | null;
  /** ID of the current funnel page; null when on the result page */
  currentPageId: string | null;
  navigationHistory: string[];
  /** Collected user answers, keyed by sectionId */
  answers: FunnelAnswers;
  /** Lead capture form data — NOT persisted to localStorage (PII) */
  leadData: LeadData;
  /** Whether the store has been hydrated with a schema */
  isReady: boolean;
  isCalculating: boolean;
  /** 0–100 percentage; null until submitFunnel() resolves */
  finalScore: number | null;
  scoreResult: FunnelScoreResult | null;
  isOnResultPage: boolean;
  /**
   * True when the lead-capture form is the active view.
   * This is a transient UI intercept between the last quiz step and the
   * result page — it is not a page in the schema and is never persisted.
   */
  isOnLeadForm: boolean;
  calcResults: CalcResults;
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type FunnelActions = {
  initFunnel: (schema: funnelPayloadSchema) => void;
  /**
   * Clears localStorage progress and resets the funnel to its first page.
   * Called by the "Retake" button — distinct from initFunnel so that
   * initFunnel can restore a completed funnel on refresh without triggering
   * an unintended retake.
   */
  retakeFunnel: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (pageId: string) => void;
  setAnswer: (sectionId: string, value: QuizAnswer) => void;
  toggleChoice: (sectionId: string, optionId: string, multi: boolean) => void;
  funnelPages: () => PagePayloadSchema[];
  resultPage: () => PagePayloadSchema | null;
  currentPage: () => PagePayloadSchema | null;
  totalSteps: () => number;
  progressPercent: () => number;
  isLastStep: () => boolean;
  resolveNextPageId: () => string | null;
  calculateScores: () => FunnelScoreResult;
  /**
   * Progressive/partial scoring for mini-result sections.
   *
   * Scopes the SAME scoring algorithm as calculateScores() to only the
   * sections the respondent has actually traversed by the time they reach a
   * given mini-result section — NOT the full funnel, and NOT a static
   * "page.order < this page's order" comparison (which would be wrong under
   * conditional branching, since a respondent can legitimately skip pages
   * that sit earlier in the default linear order).
   *
   * Scope = sections from every page already departed from (tracked exactly
   * by navigationHistory, which only ever contains pages the respondent
   * genuinely walked through) PLUS any sections on the CURRENT page that sit
   * before this mini-result section's own `order` — this covers the case of
   * a quiz section and a mini-result section sharing a single page, where
   * the mini-result should reflect the live, not-yet-departed answer above it.
   *
   * `sectionOrder` is the mini-result section's own `order` value, supplied
   * by the calling component (section.order).
   */
  partialScoreUpTo: (sectionOrder: number) => FunnelScoreResult;
  submitFunnel: () => Promise<void>;
  submitLeadForm: (data: LeadData) => Promise<void>;
  skipLeadForm: () => Promise<void>;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFunnelStore = create<FunnelState & FunnelActions>()(
  devtools(
    (set, get) => {
      // ── Private: score + result-page transition ────────────────────────────
      /**
       * Shared by submitFunnel (no lead gate), submitLeadForm, and skipLeadForm.
       * Computes scores, transitions to the result page, and marks the funnel
       * as completed in localStorage so a refresh on the result page restores
       * the result view rather than redirecting to the main page.
       */
      const resolveToResult = async () => {
        set({ isCalculating: true });

        // Mock calculation delay — replace with real API call later.
        await new Promise<void>((resolve) => setTimeout(resolve, 1_500));

        const scoreResult = get().calculateScores();
        const { schema, answers } = get();
        const calcResults = schema ? calculateVariables(schema, answers) : {};

        const resultPage = get().resultPage();

        set({
          finalScore: scoreResult.overallScore,
          scoreResult,
          calcResults,
          isCalculating: false,
          isOnResultPage: true,
          isOnLeadForm: false,
        });

        // Persist completion so result page survives a refresh.
        // answers are included so scores can be recomputed on restore.
        const { currentPageId, navigationHistory } = get();
        if (schema) {
          saveProgress(schema.id, {
            currentPageId: currentPageId ?? "",
            navigationHistory,
            answers,
            isCompleted: true,
          });
        }

        if (resultPage?.slug && typeof window !== "undefined") {
          window.history.pushState({}, "", resultPage.slug);
        }
      };

      // ── Private: save current navigation state to localStorage ─────────────
      /**
       * Called after every user-driven navigation (nextStep, prevStep page
       * transitions). Snapshots the post-navigation state so the user can
       * resume from this exact point on refresh or return.
       * NOT called on goToStep (used by the router hook for synchronization)
       * or when closing transient overlays (lead form, result page back).
       */
      const persistProgress = () => {
        const { schema, currentPageId, navigationHistory, answers } = get();
        if (!schema || !currentPageId) return;
        saveProgress(schema.id, {
          currentPageId,
          navigationHistory,
          answers,
          isCompleted: false,
        });
      };

      return {
        // ── Initial State ──────────────────────────────────────────────────────
        schema: null,
        currentPageId: null,
        navigationHistory: [],
        answers: {},
        leadData: {},
        isReady: false,
        isCalculating: false,
        finalScore: null,
        scoreResult: null,
        isOnResultPage: false,
        isOnLeadForm: false,
        calcResults: {},

        // ── initFunnel ─────────────────────────────────────────────────────────
        /**
         * Hydrates the store with the funnel schema. Restores from localStorage
         * when valid progress exists, so users resume where they left off after
         * a refresh, browser restart, or temporary abandonment.
         *
         * Three branches (evaluated in order):
         *
         * A — Completed funnel: isCompleted === true in localStorage.
         *     Restores isOnResultPage so the result page renders on refresh.
         *     Recomputes scores from the saved answers (deterministic replay).
         *
         * B — In-progress step: a valid, non-result pageId is saved.
         *     Restores currentPageId, navigationHistory, and answers.
         *     useSoftRouter Effect 1 then syncs the URL to match.
         *
         * C — No valid progress: localStorage is empty, corrupt, or the saved
         *     pageId no longer exists in the schema (deleted step).
         *     Starts fresh at the first page. useSoftRouter Effect 1 pushes
         *     that page's URL, which acts as the "redirect to main page" when
         *     the user was on a step URL with no recoverable progress.
         */
        initFunnel: (schema) => {
          //const saved = loadProgress(schema.id);

          // ── Branch A: funnel was previously completed ──────────────────────
          // if (saved?.isCompleted) {
          //   set({
          //     schema,
          //     currentPageId: null, // result page has no currentPageId
          //     navigationHistory: saved.navigationHistory,
          //     answers: saved.answers,
          //     leadData: {},
          //     isReady: true,
          //     isCalculating: false,
          //     finalScore: null,
          //     scoreResult: null,
          //     isOnResultPage: true,
          //     isOnLeadForm: false,
          //   });
          // Re-derive scores from saved answers (same deterministic algorithm
          // as the original submission — no stale cache needed).
          //   const scores = get().calculateScores();
          //   set({ finalScore: scores.overallScore, scoreResult: scores });
          //   return;
          // }

          // ── Branch B: valid in-progress step ──────────────────────────────
          // const savedPageIsValid =
          //   saved !== null &&
          //   schema.pages.some(
          //     (p) =>
          //       p.id === saved.currentPageId && p.pageType !== "result_page",
          //   );

          // if (savedPageIsValid) {
          //   set({
          //     schema,
          //     currentPageId: saved!.currentPageId,
          //     navigationHistory: saved!.navigationHistory,
          //     answers: saved!.answers,
          //     leadData: {},
          //     isReady: true,
          //     isCalculating: false,
          //     finalScore: null,
          //     scoreResult: null,
          //     isOnResultPage: false,
          //     isOnLeadForm: false,
          //   });
          //   return;
          // }

          // console.log("here");
          // ── Branch C: no valid progress — start from first page ────────────
          const firstPage = schema.pages
            .filter((p) => p.pageType !== "result_page")
            .sort((a, b) => a.order - b.order)[0];

          if (!firstPage) {
            console.error(
              "[FunnelStore] initFunnel: no valid first page found in schema.",
            );
            return;
          }

          set({
            schema,
            currentPageId: firstPage.id,
            navigationHistory: [],
            answers: {},
            leadData: {},
            isReady: true,
            isCalculating: false,
            finalScore: null,
            scoreResult: null,
            isOnResultPage: false,
            isOnLeadForm: false,
            calcResults: {},
          });
        },

        // ── retakeFunnel ───────────────────────────────────────────────────────
        /**
         * Explicit retake path. Clears localStorage so the next initFunnel
         * call lands in Branch C (fresh start), then resets in-memory state
         * to the first page without re-calling initFunnel (avoids re-loading
         * the schema object unnecessarily).
         *
         * Called by the "Retake Quiz" button in result.tsx.
         * NOT the same as initFunnel — initFunnel restores; retakeFunnel resets.
         */
        retakeFunnel: () => {
          const { schema } = get();
          if (!schema) return;

          clearProgress(schema.id);

          const firstPage = schema.pages
            .filter((p) => p.pageType !== "result_page")
            .sort((a, b) => a.order - b.order)[0];

          if (!firstPage) return;

          set({
            currentPageId: firstPage.id,
            navigationHistory: [],
            answers: {},
            leadData: {},
            isCalculating: false,
            finalScore: null,
            scoreResult: null,
            isOnResultPage: false,
            isOnLeadForm: false,
            calcResults: {},
          });
        },

        // ── nextStep ───────────────────────────────────────────────────────────
        nextStep: () => {
          const { isOnResultPage, schema } = get();
          if (isOnResultPage) return;

          const rawPageId = get().currentPageId;
          const isValidPageId =
            typeof rawPageId === "string" &&
            !!schema?.pages.some((p) => p.id === rawPageId);

          if (!isValidPageId) {
            const first = get().funnelPages()[0];
            if (!first) return;
            set({ currentPageId: first.id });
          }

          const nextId = get().resolveNextPageId();
          if (nextId === null) return;

          const confirmedCurrentId = get().currentPageId!;

          set({
            navigationHistory: [...get().navigationHistory, confirmedCurrentId],
            currentPageId: nextId,
          });

          // Persist immediately after navigation so a refresh lands on this step.
          persistProgress();
        },

        // ── prevStep ───────────────────────────────────────────────────────────
        prevStep: () => {
          const { isOnLeadForm, isOnResultPage, navigationHistory } = get();

          // Lead form and result page are transient UI overlays — not steps in
          // navigationHistory. Closing them requires no index/history changes;
          // currentPageId already correctly points at the underlying funnel step.
          if (isOnLeadForm) {
            set({ isOnLeadForm: false });
            return;
          }

          if (isOnResultPage) {
            set({
              isOnResultPage: false,
              finalScore: null,
              scoreResult: null,
            });
            return;
          }

          if (navigationHistory.length === 0) return;
          const prev = navigationHistory[navigationHistory.length - 1];
          set({
            currentPageId: prev,
            navigationHistory: navigationHistory.slice(0, -1),
          });

          // Persist the new position so a refresh on the previous step is correct.
          persistProgress();
        },

        // ── goToStep ───────────────────────────────────────────────────────────
        // Validates pageId against the loaded schema before writing to state.
        // Called by useSoftRouter for URL→store synchronization — NOT persisted,
        // as this is a router bookkeeping call, not a user navigation action.
        goToStep: (pageId: string) => {
          const { schema } = get();
          if (!schema) return;

          const page = schema.pages.find((p) => p.id === pageId);
          if (!page) return;

          set({ currentPageId: pageId, isOnResultPage: false });
        },

        setAnswer: (sectionId, value) => {
          const { answers } = get();
          set({ answers: { ...answers, [sectionId]: value } });
        },

        toggleChoice: (sectionId, optionId, multi) => {
          const { answers } = get();
          const current = (answers[sectionId] as string[] | undefined) ?? [];

          const updated: string[] = multi
            ? current.includes(optionId)
              ? current.filter((id) => id !== optionId)
              : [...current, optionId]
            : current.includes(optionId)
              ? []
              : [optionId];

          set({ answers: { ...answers, [sectionId]: updated } });
        },

        // ── Derived Selectors ─────────────────────────────────────────────────

        funnelPages: () =>
          (get().schema?.pages ?? [])
            .filter((p) => p.pageType !== "result_page")
            .sort((a, b) => a.order - b.order),

        resultPage: () =>
          get().schema?.pages.find((p) => p.pageType === "result_page") ?? null,

        currentPage: () => {
          const { isOnResultPage, currentPageId, schema } = get();
          if (isOnResultPage) return get().resultPage();
          if (!currentPageId || !schema) return null;
          return schema.pages.find((p) => p.id === currentPageId) ?? null;
        },

        totalSteps: () => get().funnelPages().length,

        progressPercent: () => {
          const pages = get().funnelPages();
          if (pages.length <= 1) return 0;
          return Math.min(
            100,
            Math.round(
              (get().navigationHistory.length / (pages.length - 1)) * 100,
            ),
          );
        },

        isLastStep: () => get().resolveNextPageId() === null,

        resolveNextPageId: (): string | null => {
          const { currentPageId, answers, schema } = get();
          if (!currentPageId || !schema) return null;

          const page = schema.pages.find((p) => p.id === currentPageId);
          if (!page) return null;

          for (const section of page.sections) {
            if (section.type !== "quiz") continue;
            const content = section.content as Quiz1Content;

            // ── Priority 1: section-level compound rules ─────────────────────
            // NOTE: no `scores` argument is passed here, so score_above /
            // score_below conditions on a branchRule will currently always
            // evaluate to false (see evaluateBranchCondition in helpers.ts).
            // Wiring live partial scores into navigation-time branching is a
            // follow-up (architecture roadmap Module 4/5) — mini-result
            // brackets already support it via partialScoreUpTo() below.
            if (content.branchRules?.length) {
              const sorted = [...content.branchRules].sort(
                (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
              );
              for (const rule of sorted) {
                if (!evaluateBranchPredicate(rule.predicate, answers)) continue;
                if (rule.target.type === "external_redirect") {
                  if (typeof window !== "undefined")
                    window.location.href = rule.target.url;
                  return null;
                }
                return rule.target.pageId;
              }
            }

            // ── Priority 2: option-level branch targets ───────────────────────
            const selectedIds =
              (answers[section.id] as string[] | undefined) ?? [];
            for (const selectedId of selectedIds) {
              const option = content.quizOptions?.find(
                (o) => o.id === selectedId,
              );
              if (!option?.branchTarget) continue;
              if (option.branchTarget.type === "external_redirect") {
                if (typeof window !== "undefined")
                  window.location.href = option.branchTarget.url;
                return null;
              }
              return option.branchTarget.pageId;
            }
          }

          // ── Priority 3: default linear next page ─────────────────────────────
          const linearPages = get()
            .funnelPages()
            .filter((p) => p.isLinearDefault !== false);

          const idx = linearPages.findIndex((p) => p.id === currentPageId);

          if (idx === -1) return null;

          return linearPages[idx + 1]?.id ?? null;
        },

        // ── Full-funnel scoring (final score, computed at submission time) ─────
        calculateScores: (): FunnelScoreResult => {
          const { schema, answers } = get();
          if (!schema) return EMPTY_FUNNEL_SCORE_RESULT;

          const allSections = schema.pages.flatMap((p) => p.sections);
          return computeFunnelScore(
            allSections,
            schema.questionCategories ?? [],
            answers,
            schema.scoreTiers ?? DEFAULT_SCORE_TIERS,
          );
        },

        // ── Progressive/partial scoring (mini-result sections) ──────────────────
        partialScoreUpTo: (sectionOrder: number): FunnelScoreResult => {
          const { schema, answers, navigationHistory, currentPageId } = get();
          if (!schema) return EMPTY_FUNNEL_SCORE_RESULT;

          const visitedPageIds = new Set(navigationHistory);

          const traversedSections = schema.pages
            .filter((p) => visitedPageIds.has(p.id))
            .flatMap((p) => p.sections);

          const activePage = schema.pages.find((p) => p.id === currentPageId);
          const samePageEarlierSections = (activePage?.sections ?? []).filter(
            (s) => s.order < sectionOrder,
          );

          return computeFunnelScore(
            [...traversedSections, ...samePageEarlierSections],
            schema.questionCategories ?? [],
            answers,
            schema.scoreTiers ?? DEFAULT_SCORE_TIERS,
          );
        },

        // ── Submission & lead gate ────────────────────────────────────────────

        submitFunnel: async () => {
          const { schema } = get();

          if (schema?.lead_form?.enable_lead_signup) {
            set({ isOnLeadForm: true });
            return;
          }

          await resolveToResult();
        },

        submitLeadForm: async (data: LeadData) => {
          set({ leadData: data });
          await resolveToResult();
        },

        skipLeadForm: async () => {
          await resolveToResult();
        },
      };
    },
    { name: "FunnelStore" },
  ),
);
