import { LeadData, ScoreTier } from "@/types/PageCMS/pageSchema";

// ─── Personalization domain model ──────────────────────────────────────────
//
// These types are the runtime, lookup-optimized shape the personalization
// engine operates on — distinct from FunnelScoreResult/CategoryScoreResult
// (the scoring domain) on purpose: this module reshapes already-computed
// scoring output into a form suited to O(1) token resolution (Maps keyed by
// the same sectionId/categoryId used everywhere else in the schema), without
// re-deriving any of the underlying numbers. See buildContext.ts.

export type QuestionVariable = {
  sectionId: string;
  title: string;
  answerLabel: string;
  score: number;
  maxScore: number;
};

export type CategoryVariable = {
  categoryId: string;
  title: string;
  /** Raw earned points (CategoryScoreResult.earnedPoints). */
  value: number;
  /** Raw max points (CategoryScoreResult.maxPoints). */
  maxValue: number;
  /** 0–100 normalized score (CategoryScoreResult.score). */
  percentage: number;
  tier: ScoreTier | null;
};

export type GlobalVariables = {
  highestCategory: CategoryVariable | null;
  lowestCategory: CategoryVariable | null;
  totalQuestions: number;
};

/**
 * The full personalization context for a single Result Page render.
 * Built once per page (see hooks/usePersonalizationContext.ts) and passed
 * by reference into every section/card that needs to resolve tokens —
 * cheap to share, since it's just three Maps/objects, not recomputed per
 * consumer.
 */
export type PersonalizationContext = {
  questions: Map<string, QuestionVariable>;
  categories: Map<string, CategoryVariable>;
  global: GlobalVariables;
  /** Passthrough — preserves the existing bare {{first_name}}-style tokens. */
  lead: LeadData;
};

/**
 * Render-local bindings that scope certain tokens to "whichever instance is
 * currently rendering" — e.g. a category card binds `currentCategoryId` to
 * its own category so its shared template can refer to "category.current.*"
 * without knowing its own id in advance.
 */
export type LocalRenderContext = {
  currentCategoryId?: string;
};

export type InterpolateOptions = {
  local?: LocalRenderContext;
};
