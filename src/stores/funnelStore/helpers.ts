import {
  BranchCondition,
  FunnelAnswers,
  BranchPredicate,
  PageSection,
  QuizSectionContent,
  QuizOptions,
  QuestionCategory,
  QuestionType,
  QuizAnswer,
  CategoryScoreResult,
  QuestionScoreResult,
  FunnelScoreResult,
  ScoreTier,
  // ── Audience segmentation types ───────────────────────────────────────────
  AudienceCondition,
  AudiencePredicate,
  AudienceDefinition,
  SectionVisibility,
  LeadData,
  // ── Calculation engine types ──────────────────────────────────────────────
  CalcExpression,
  CalcVariable,
  CalcResultEntry,
  CalcResults,
  funnelPayloadSchema,
} from "@/types/PageCMS/pageSchema";

// ─── Branch / predicate evaluation ─────────────────────────────────────────
//
// Pure, store-free evaluators. Shared by:
//   • store.ts resolveNextPageId()        — section-level branchRules (navigation)
//   • resolveBracket() below, used by miniResults.tsx — content brackets
//
// Kept here (not in the store) so they remain independently testable and
// reusable by future tooling (e.g. builder simulation mode), per the
// project's "pure functions extracted to helpers.ts" principle.

export function evaluateBranchCondition(
  condition: BranchCondition,
  answers: FunnelAnswers,
  scores?: FunnelScoreResult,
): boolean {
  switch (condition.type) {
    case "option_selected": {
      const rawAnswer = answers[condition.sectionId];
      const selected = Array.isArray(rawAnswer) ? rawAnswer : [];
      return condition.optionIds.some((id) => selected.includes(id));
    }
    case "option_not_selected": {
      const rawAnswer = answers[condition.sectionId];
      const selected = Array.isArray(rawAnswer) ? rawAnswer : [];
      return !condition.optionIds.some((id) => selected.includes(id));
    }
    case "score_above":
    case "score_below": {
      // No score context supplied (e.g. evaluated at navigation time, before
      // any scoring pass has run for this context) — fail closed rather
      // than silently matching.
      if (!scores) return false;

      const value = condition.categoryId
        ? // Category not yet encountered in the scoped section set (e.g. its
          // question hasn't been reached/answered yet) → treated as 0,
          // consistent with how categoryScores already omits zero-max
          // categories from the result.
          (scores.categoryScores.find(
            (c) => c.categoryId === condition.categoryId,
          )?.score ?? 0)
        : scores.overallScore;

      return condition.type === "score_above"
        ? value > condition.threshold
        : value < condition.threshold;
    }
    default:
      return false;
  }
}

export function evaluateBranchPredicate(
  predicate: BranchPredicate,
  answers: FunnelAnswers,
  scores?: FunnelScoreResult,
): boolean {
  const results = predicate.conditions.map((c) =>
    evaluateBranchCondition(c, answers, scores),
  );
  return predicate.operator === "OR"
    ? results.some(Boolean)
    : results.every(Boolean);
}

// ─── Bracket resolution (mini-result / future outcome-page brackets) ───────

/**
 * Resolves the single content bracket that should render, given the current
 * answer/score state. Generic over any bracket shape carrying an optional
 * `predicate` and `priority` — used today by ScoreBracketContent, and
 * intended to be reused as-is by the future operator-configurable
 * outcome-page bracket system (architecture roadmap Module 5/7).
 *
 * Resolution order:
 *   1. Brackets WITH a predicate, sorted by priority descending (ties keep
 *      array order — Array.prototype.sort is stable). First match wins.
 *   2. If none match, the first bracket WITHOUT a predicate (the fallback).
 *   3. If neither exists, returns undefined — callers should treat this as
 *      a content-authoring gap (a mini-result section should always define
 *      a fallback bracket).
 */
export function resolveBracket<
  T extends { predicate?: BranchPredicate; priority?: number },
>(
  brackets: T[],
  answers: FunnelAnswers,
  scores: FunnelScoreResult,
): T | undefined {
  const sorted = [...brackets].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );

  for (const bracket of sorted) {
    if (!bracket.predicate) continue;
    if (evaluateBranchPredicate(bracket.predicate, answers, scores)) {
      return bracket;
    }
  }

  return sorted.find((b) => !b.predicate);
}

// ─── Audience segmentation — evaluation layer ─────────────────────────────
//
// Pure, store-free evaluators. The same AudienceCondition / AudiencePredicate
// grammar is reusable server-side for retroactive batch re-segmentation
// (Node.js worker, edge function) without any React or Zustand dependency.
//
// Design invariants:
//   • evaluateAudienceCondition delegates existing BranchCondition types to
//     the already-tested evaluateBranchCondition — no duplication.
//   • evaluateAudiencePredicate recurses naturally over nested groups
//     (AudiencePredicate within AudiencePredicate) via the type discriminant.
//   • resolveAudienceMembership is called ONCE in resolveToResult (store.ts),
//     never on every render — the Set is stored in Zustand state.
//   • resolveSectionVisibility is pure and cheap — called inside
//     SectionTypeRenderer before the switch dispatch.

/**
 * Full context required to evaluate any AudienceCondition variant.
 * All fields are already available in the store at result-page time:
 *   - answers      → FunnelState.answers
 *   - leadData     → FunnelState.leadData
 *   - scoreResult  → FunnelState.scoreResult (set by resolveToResult)
 */
export type AudienceEvaluationContext = {
  answers: FunnelAnswers;
  leadData: LeadData;
  scoreResult: FunnelScoreResult;
};

/**
 * Evaluates a single AudienceCondition leaf node.
 *
 * Handles the three new audience condition types:
 *   lead_field_equals — compares a lead form field value using the specified
 *     operator. String comparisons are case-insensitive. Numeric comparisons
 *     cast the stored value to float; returns false when the cast fails.
 *   category_rank — determines whether the named category holds the highest
 *     or lowest score rank. Ties are inclusive (both tied categories qualify).
 *   category_score — compares a category or overall score metric against a
 *     threshold using a numeric operator. tier_id comparisons use eq/neq only
 *     (other operators return false for non-numeric tier IDs).
 *
 * BranchCondition types (option_selected, option_not_selected, score_above,
 * score_below) delegate to the existing evaluateBranchCondition, which already
 * handles the `scores` argument correctly.
 */
export function evaluateAudienceCondition(
  condition: AudienceCondition,
  ctx: AudienceEvaluationContext,
): boolean {
  // ── Delegate existing BranchCondition types ─────────────────────────────
  if (
    condition.type === "option_selected" ||
    condition.type === "option_not_selected" ||
    condition.type === "score_above" ||
    condition.type === "score_below"
  ) {
    return evaluateBranchCondition(condition, ctx.answers, ctx.scoreResult);
  }

  switch (condition.type) {
    // ── Lead form field condition ──────────────────────────────────────────
    case "lead_field_equals": {
      const raw = ctx.leadData[condition.fieldId];
      if (raw === undefined || raw === null) return false;

      // Boolean comparison (custom_checkbox fields)
      if (typeof condition.value === "boolean") {
        return condition.operator === "eq"
          ? Boolean(raw) === condition.value
          : Boolean(raw) !== condition.value;
      }

      // Numeric comparison (custom_number fields)
      if (typeof condition.value === "number") {
        const numRaw = parseFloat(String(raw));
        if (isNaN(numRaw)) return false;
        return applyNumericOperator(
          numRaw,
          condition.operator as string,
          condition.value,
        );
      }

      // String comparison — case-insensitive
      const strRaw = String(raw).toLowerCase();
      const strVal = String(condition.value).toLowerCase();
      switch (condition.operator) {
        case "eq":
          return strRaw === strVal;
        case "neq":
          return strRaw !== strVal;
        case "contains":
          return strRaw.includes(strVal);
        case "starts_with":
          return strRaw.startsWith(strVal);
        // Numeric operators applied to strings: cast both sides
        default: {
          const n = parseFloat(strRaw);
          const v = parseFloat(strVal);
          if (isNaN(n) || isNaN(v)) return false;
          return applyNumericOperator(n, condition.operator, v);
        }
      }
    }

    // ── Category rank condition ────────────────────────────────────────────
    case "category_rank": {
      const scores = ctx.scoreResult.categoryScores;
      if (scores.length === 0) return false;

      if (condition.rank === "highest") {
        const maxScore = Math.max(...scores.map((c) => c.score));
        // Ties are inclusive — both tied categories qualify as "highest"
        return scores.some(
          (c) => c.categoryId === condition.categoryId && c.score === maxScore,
        );
      } else {
        const minScore = Math.min(...scores.map((c) => c.score));
        return scores.some(
          (c) => c.categoryId === condition.categoryId && c.score === minScore,
        );
      }
    }

    // ── Category / overall score condition ────────────────────────────────
    case "category_score": {
      const { categoryId, metric, operator, value } = condition;

      if (metric === "tier_id") {
        // tier_id comparison: string eq/neq only
        const tierId =
          categoryId === "overall"
            ? ctx.scoreResult.overallTier?.id
            : ctx.scoreResult.categoryScores.find(
                (c) => c.categoryId === categoryId,
              )?.tier?.id;

        if (tierId === undefined) return false;
        const strVal = String(value);
        if (operator === "eq") return tierId === strVal;
        if (operator === "neq") return tierId !== strVal;
        // Non-equality operators are meaningless for string tier IDs
        return false;
      }

      // Numeric metrics: percentage or earned_points
      let metricValue: number;
      if (categoryId === "overall") {
        metricValue =
          metric === "percentage"
            ? ctx.scoreResult.overallScore
            : ctx.scoreResult.uncategorizedEarnedPoints; // best available overall points proxy
      } else {
        const cat = ctx.scoreResult.categoryScores.find(
          (c) => c.categoryId === categoryId,
        );
        if (!cat) return false;
        metricValue = metric === "percentage" ? cat.score : cat.earnedPoints;
      }

      if (typeof value !== "number") return false;
      return applyNumericOperator(metricValue, operator, value);
    }

    default:
      // Exhaustiveness guard — new condition types produce a compile error here
      return false;
  }
}

/**
 * Applies a numeric comparison operator. Extracted as a private helper to
 * avoid duplicating the switch across lead_field_equals and category_score.
 */
function applyNumericOperator(
  left: number,
  operator: string,
  right: number,
): boolean {
  switch (operator) {
    case "gt":
      return left > right;
    case "lt":
      return left < right;
    case "gte":
      return left >= right;
    case "lte":
      return left <= right;
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    default:
      return false;
  }
}

/**
 * Evaluates a compound AudiencePredicate, supporting arbitrary nesting.
 * A `condition` entry is treated as a nested group when it has an `operator`
 * field and a `conditions` array (i.e. it is itself an AudiencePredicate),
 * otherwise it is treated as a leaf AudienceCondition.
 *
 * Operator semantics:
 *   AND → every condition in the group must evaluate to true
 *   OR  → at least one condition must evaluate to true
 */
export function evaluateAudiencePredicate(
  predicate: AudiencePredicate,
  ctx: AudienceEvaluationContext,
): boolean {
  const results = predicate.conditions.map((entry) => {
    // Distinguish nested AudiencePredicate from leaf AudienceCondition by
    // checking for the presence of the `operator` + `conditions` shape.
    if (
      typeof entry === "object" &&
      "operator" in entry &&
      "conditions" in entry &&
      Array.isArray((entry as AudiencePredicate).conditions)
    ) {
      return evaluateAudiencePredicate(entry as AudiencePredicate, ctx);
    }
    return evaluateAudienceCondition(entry as AudienceCondition, ctx);
  });

  return predicate.operator === "OR"
    ? results.some(Boolean)
    : results.every(Boolean);
}

/**
 * Resolves the complete set of audience IDs that the current respondent
 * matches, given the full post-submission context.
 *
 * Called ONCE inside resolveToResult() (store.ts) alongside calculateScores()
 * and calculateVariables(). The returned Set is stored in Zustand state
 * (audienceMembership) and consumed by resolveSectionVisibility() during
 * rendering. Never re-evaluated per-render.
 *
 * Returns an empty Set when `audiences` is empty or undefined — rendering
 * falls back to the "always-visible" default for every section.
 */
export function resolveAudienceMembership(
  audiences: AudienceDefinition[],
  ctx: AudienceEvaluationContext,
): Set<string> {
  const matched = new Set<string>();
  for (const audience of audiences) {
    if (evaluateAudiencePredicate(audience.predicate, ctx)) {
      matched.add(audience.id);
    }
  }
  return matched;
}

/**
 * Determines whether a section should be rendered given the respondent's
 * resolved audience membership.
 *
 * Called inside SectionTypeRenderer before the template_id switch. A false
 * return short-circuits to null without touching the component tree.
 *
 * Visibility resolution:
 *   absent / "always-visible" → true  (zero-regression default)
 *   "none"                    → false
 *   "audience-based"          → true if audienceMembership ∩ audienceIds ≠ ∅
 *                               (OR semantics across the audience list)
 */
export function resolveSectionVisibility(
  section: PageSection,
  audienceMembership: Set<string>,
): boolean {
  const vis = section.visibility;

  // Absent or always-visible: render unconditionally (default for all legacy sections)
  if (!vis || vis.mode === "always-visible") return true;

  // Explicitly hidden
  if (vis.mode === "none") return false;

  // Audience-based: render if the lead matches ANY of the listed audiences
  if (vis.mode === "audience-based") {
    return vis.audienceIds.some((id) => audienceMembership.has(id));
  }

  // Exhaustiveness fallback — treat unknown modes as always-visible
  return true;
}

/**
 * The default score tier ladder applied to any funnel that doesn't define
 * its own `scoreTiers`. Three contiguous, non-overlapping bands covering the
 * full 0–100 range, per the feature spec's stated default.
 */
export const DEFAULT_SCORE_TIERS: ScoreTier[] = [
  {
    id: "tier_1",
    label: "Tier 1",
    color: "#ef4444",
    score_from: 0,
    score_to: 33,
  },
  {
    id: "tier_2",
    label: "Tier 2",
    color: "#f59e0b",
    score_from: 34,
    score_to: 66,
  },
  {
    id: "tier_3",
    label: "Tier 3",
    color: "#22c55e",
    score_from: 67,
    score_to: 100,
  },
];

/**
 * Resolves the score tier a given 0–100 score falls into.
 *
 * Primary path: exact range containment (inclusive both ends) — correct for
 * any well-formed, contiguous tier ladder (1–10 tiers, per the cardinality
 * constraint on ScoreTier).
 *
 * Fallback path: if no tier's range contains the score (a malformed/gapped
 * config — e.g. an author leaves a hole between two ranges), returns the
 * tier whose range is numerically closest to the score, so a score is never
 * left unlabeled in production. Returns null only when `tiers` is empty.
 *
 * Pure and store-free — reusable wherever a (score, tiers) pair needs
 * classifying, independent of which funnel/category it came from.
 */
export function resolveScoreTier(
  score: number,
  tiers: ScoreTier[],
): ScoreTier | null {
  if (tiers.length === 0) return null;

  const exact = tiers.find((t) => score >= t.score_from && score <= t.score_to);
  if (exact) return exact;

  const distanceToRange = (t: ScoreTier): number => {
    if (score < t.score_from) return t.score_from - score;
    if (score > t.score_to) return score - t.score_to;
    return 0;
  };

  return tiers.reduce((closest, t) =>
    distanceToRange(t) < distanceToRange(closest) ? t : closest,
  );
}

// ─── Answer label resolution ──────────────────────────────────────────────

/**
 * Resolves a human-readable label for a question's stored answer, regardless
 * of question type or scoreability. Used to populate
 * QuestionScoreResult.answerLabel, which feeds the personalization system's
 * Question Variables (question.<sectionId>.answer).
 *
 *  - single_choice / multiple_choice → selected option title(s), comma-joined
 *    for multi-select. Falls back to "" if the selected id no longer matches
 *    any option (e.g. stale answer against an edited schema).
 *  - short_text / long_text / number / scale → the raw stored value,
 *    stringified.
 *  - unanswered → "".
 */
function resolveAnswerLabel(
  qType: QuestionType,
  rawAnswer: QuizAnswer | undefined,
  options: QuizOptions[],
): string {
  if (rawAnswer === undefined || rawAnswer === null) return "";

  if (qType === "single_choice" || qType === "multiple_choice") {
    const selectedIds = Array.isArray(rawAnswer) ? rawAnswer : [];
    const labels = selectedIds
      .map((id) => options.find((o) => o.id === id)?.title)
      .filter((t): t is string => Boolean(t));
    return labels.join(", ");
  }

  return String(rawAnswer);
}

// ─── Scoring engine (pure) ──────────────────────────────────────────────────

/**
 * The funnel's zero-value score result. Exported so every caller (store init
 * state, partial-scope callers with no schema yet, etc.) shares one literal
 * instead of redefining it ad hoc.
 */
export const EMPTY_FUNNEL_SCORE_RESULT: FunnelScoreResult = {
  overallScore: 0,
  overallTier: null,
  categoryScores: [],
  questionScores: [],
  uncategorizedScore: 0,
  uncategorizedEarnedPoints: 0,
  uncategorizedMaxPoints: 0,
};

/**
 * SCORING ALGORITHM
 * ─────────────────
 * Pure, section-scoped scoring. Operates over whatever flat list of
 * `PageSection`s it's given — it has no notion of "the whole funnel" itself.
 * This is what makes it reusable for two distinct callers in the store:
 *
 *   • calculateScores()   → pass EVERY section in the schema (full-funnel
 *                            final score, computed at submission time).
 *   • partialScoreUpTo()  → pass only sections the respondent has actually
 *                            traversed so far (mini-result brackets).
 *
 * 1. Iterate every quiz section in `sections`.
 * 2. For EVERY quiz section (regardless of question type or scoreability),
 *    push a QuestionScoreResult record — title, resolved answer label, and
 *    earned/max points (0/0 for non-scoreable types). This is the single
 *    source of per-question detail consumed by the personalization system
 *    (lib/personalization/buildContext.ts) — built in this same pass, never
 *    re-derived by a second traversal.
 * 3. For scoreable questions (single_choice | multiple_choice with at least
 *    one positively-scored option):
 *    a. Compute questionMax (best possible) and questionEarned (user's answer).
 *    b. If categoryIds is empty/absent → question is "uncategorized".
 *       Each uncategorized question is tracked individually.
 *    c. If categoryIds is non-empty → add earned/max into each referenced
 *       category's accumulator (a question shared by two categories
 *       contributes its points to both).
 * 4. For the overall score and each category score, resolve the matching
 *    ScoreTier from `scoreTiers` in the same pass — no second traversal.
 *
 * Category Score  = (earned / max) × 100   per category
 *
 * Overall Score   = (Σ categoryScores + Σ per-uncategorized-question %)
 *                   ────────────────────────────────────────────────────
 *                   (# categories with questions + # uncategorized questions)
 *
 * A category with zero accumulated max points (i.e. not represented at all
 * in `sections`) is omitted from categoryScores entirely — this is what lets
 * partial scoring naturally "forget" categories the respondent hasn't
 * reached yet, with no extra bookkeeping required by callers.
 */
export function computeFunnelScore(
  sections: PageSection[],
  categories: QuestionCategory[],
  answers: FunnelAnswers,
  scoreTiers: ScoreTier[] = DEFAULT_SCORE_TIERS,
): FunnelScoreResult {
  const catAccumulators = new Map<string, { earned: number; max: number }>(
    categories.map((c) => [c.id, { earned: 0, max: 0 }]),
  );

  const uncategorizedQuestions: Array<{ earned: number; max: number }> = [];
  const questionScores: QuestionScoreResult[] = [];

  for (const section of sections) {
    if (section.type !== "quiz") continue;

    const content = section.content as QuizSectionContent;
    const qType = content.questionType;
    const options: QuizOptions[] = content.quizOptions ?? [];
    const rawAnswer = answers[section.id];
    const answerLabel = resolveAnswerLabel(qType, rawAnswer, options);

    // ── Non-scoreable question types: record detail, skip scoring ─────────
    if (qType !== "single_choice" && qType !== "multiple_choice") {
      questionScores.push({
        sectionId: section.id,
        title: content.quizHeading,
        answerLabel,
        earnedPoints: 0,
        maxPoints: 0,
      });
      continue;
    }

    const scoredOptions = options.filter((o) => o.score > 0);
    if (scoredOptions.length === 0) {
      // Choice question, but authored with no positive-score options —
      // still expose question detail, contributes nothing to scoring.
      questionScores.push({
        sectionId: section.id,
        title: content.quizHeading,
        answerLabel,
        earnedPoints: 0,
        maxPoints: 0,
      });
      continue;
    }

    const questionMax =
      qType === "single_choice"
        ? Math.max(...scoredOptions.map((o) => o.score))
        : scoredOptions.reduce((s, o) => s + o.score, 0);

    const selectedIds = (answers[section.id] as string[] | undefined) ?? [];
    const questionEarned = selectedIds.reduce((sum, id) => {
      const opt = options.find((o) => o.id === id);
      return sum + (opt?.score ?? 0);
    }, 0);

    questionScores.push({
      sectionId: section.id,
      title: content.quizHeading,
      answerLabel,
      earnedPoints: questionEarned,
      maxPoints: questionMax,
    });

    const sectionCategoryIds = content.categoryIds ?? [];

    if (sectionCategoryIds.length === 0) {
      uncategorizedQuestions.push({
        earned: questionEarned,
        max: questionMax,
      });
    } else {
      for (const catId of sectionCategoryIds) {
        const acc = catAccumulators.get(catId);
        if (acc) {
          acc.earned += questionEarned;
          acc.max += questionMax;
        }
      }
    }
  }

  const categoryScores: CategoryScoreResult[] = categories
    .filter((cat) => (catAccumulators.get(cat.id)?.max ?? 0) > 0)
    .map((cat) => {
      const acc = catAccumulators.get(cat.id)!;
      const score = Math.round((acc.earned / acc.max) * 100);
      return {
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryIcon: cat.icon,
        earnedPoints: acc.earned,
        maxPoints: acc.max,
        score,
        tier: resolveScoreTier(score, scoreTiers),
      };
    });

  const uncategorizedEarnedPoints = uncategorizedQuestions.reduce(
    (s, q) => s + q.earned,
    0,
  );
  const uncategorizedMaxPoints = uncategorizedQuestions.reduce(
    (s, q) => s + q.max,
    0,
  );
  const uncategorizedScore =
    uncategorizedMaxPoints > 0
      ? Math.round((uncategorizedEarnedPoints / uncategorizedMaxPoints) * 100)
      : 0;

  const categoryScoreSum = categoryScores.reduce((s, c) => s + c.score, 0);
  const uncategorizedPerQuestionSum = uncategorizedQuestions.reduce(
    (s, q) => s + (q.max > 0 ? Math.round((q.earned / q.max) * 100) : 0),
    0,
  );
  const denominator = categoryScores.length + uncategorizedQuestions.length;
  const overallScore =
    denominator > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (categoryScoreSum + uncategorizedPerQuestionSum) / denominator,
            ),
          ),
        )
      : 0;

  return {
    overallScore,
    overallTier: resolveScoreTier(overallScore, scoreTiers),
    categoryScores,
    questionScores,
    uncategorizedScore,
    uncategorizedEarnedPoints,
    uncategorizedMaxPoints,
  };
}

// ─── Calculation engine ───────────────────────────────────────────────────────
//
// Pure, store-free functions. No imports from the store; callable from
// store.ts, future builder simulation mode, and unit tests alike.

// ── Internal types ────────────────────────────────────────────────────────────

type SectionScoreEntry = {
  options: { id: string; score: number }[];
  maxScore: number;
};
type SectionScoreIndex = Map<string, SectionScoreEntry>;

type EvaluationContext = {
  answers: FunnelAnswers;
  sectionScoreIndex: SectionScoreIndex;
  resolvedCalcs: Map<string, number | null>;
};

// ── Schema validation ─────────────────────────────────────────────────────────

/**
 * Validates that every `calc_ref` node in the variables array points to a
 * known variable ID. Returns human-readable error strings for each violation.
 * Called at initFunnel() time so authoring errors surface at startup.
 */
export function validateCalcVariables(variables: CalcVariable[]): string[] {
  const knownIds = new Set(variables.map((v) => v.id));
  const errors: string[] = [];
  for (const v of variables) {
    for (const ref of collectCalcRefs(v.expression)) {
      if (!knownIds.has(ref)) {
        errors.push(
          `[CalcEngine] Variable "${v.id}" references unknown calcId "${ref}". ` +
            `Its computed value will be null at runtime.`,
        );
      }
    }
  }
  return errors;
}

// ── Recursive calc_ref collector ──────────────────────────────────────────────

function collectCalcRefs(expr: CalcExpression): string[] {
  switch (expr.type) {
    case "literal":
    case "answer_ref":
      return [];
    case "calc_ref":
      return [expr.calcId];
    case "binary_op":
      return [...collectCalcRefs(expr.left), ...collectCalcRefs(expr.right)];
    case "unary_op":
      return collectCalcRefs(expr.operand);
    case "conditional":
      return [
        ...collectCalcRefs(expr.condition.left),
        ...collectCalcRefs(expr.condition.right),
        ...collectCalcRefs(expr.consequent),
        ...collectCalcRefs(expr.alternate),
      ];
  }
}

// ── Topological sort (Kahn's BFS) ─────────────────────────────────────────────

/**
 * Sorts CalcVariable[] into evaluation order so every `calc_ref` lookup
 * finds an already-resolved value. Variables in a dependency cycle are
 * excluded from `sorted` and returned in `cycleIds`.
 */
export function topologicalSortCalcVars(variables: CalcVariable[]): {
  sorted: CalcVariable[];
  cycleIds: Set<string>;
} {
  const idToVar = new Map(variables.map((v) => [v.id, v]));

  const varDeps = new Map<string, string[]>();
  for (const v of variables) {
    const refs = [
      ...new Set(collectCalcRefs(v.expression).filter((id) => idToVar.has(id))),
    ];
    varDeps.set(v.id, refs);
  }

  const inDegree = new Map<string, number>();
  for (const v of variables) inDegree.set(v.id, varDeps.get(v.id)?.length ?? 0);

  const dependents = new Map<string, string[]>();
  for (const v of variables) {
    for (const dep of varDeps.get(v.id) ?? []) {
      if (!dependents.has(dep)) dependents.set(dep, []);
      dependents.get(dep)!.push(v.id);
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) if (deg === 0) queue.push(id);

  const sorted: CalcVariable[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const v = idToVar.get(id);
    if (v) sorted.push(v);
    for (const dep of dependents.get(id) ?? []) {
      const nd = (inDegree.get(dep) ?? 0) - 1;
      inDegree.set(dep, nd);
      if (nd === 0) queue.push(dep);
    }
  }

  const sortedIds = new Set(sorted.map((v) => v.id));
  const cycleIds = new Set(
    variables.filter((v) => !sortedIds.has(v.id)).map((v) => v.id),
  );
  return { sorted, cycleIds };
}

// ── Section score index builder ───────────────────────────────────────────────

function buildSectionScoreIndex(
  schema: funnelPayloadSchema,
): SectionScoreIndex {
  const index: SectionScoreIndex = new Map();
  for (const page of schema.pages) {
    for (const section of page.sections) {
      if (section.type !== "quiz") continue;
      const content = section.content as QuizSectionContent;
      const opts = (content.quizOptions ?? []).map((o) => ({
        id: o.id,
        score: o.score,
      }));
      let maxScore = 0;
      if (content.questionType === "single_choice") {
        const pos = opts.filter((o) => o.score > 0).map((o) => o.score);
        maxScore = pos.length > 0 ? Math.max(...pos) : 0;
      } else if (content.questionType === "multiple_choice") {
        maxScore = opts
          .filter((o) => o.score > 0)
          .reduce((s, o) => s + o.score, 0);
      }
      index.set(section.id, { options: opts, maxScore });
    }
  }
  return index;
}

// ── Recursive expression evaluator ───────────────────────────────────────────

/**
 * Evaluates a CalcExpression AST node. Returns null on any error
 * (missing answer, division by zero, failed dependency) — null propagates
 * up the tree. Substituting 0 silently for financial formulas is worse
 * than showing error_fallback.
 */
function evaluateCalcExpression(
  node: CalcExpression,
  ctx: EvaluationContext,
): number | null {
  switch (node.type) {
    case "literal":
      return node.value;

    case "answer_ref": {
      const raw = ctx.answers[node.sectionId];
      switch (node.transform) {
        case "value":
          return typeof raw === "number" && !isNaN(raw) ? raw : null;
        case "score_sum": {
          const entry = ctx.sectionScoreIndex.get(node.sectionId);
          if (!entry) return null;
          const selected = (raw as string[] | undefined) ?? [];
          return entry.options
            .filter((o) => selected.includes(o.id))
            .reduce((s, o) => s + o.score, 0);
        }
        case "score_max":
          return ctx.sectionScoreIndex.get(node.sectionId)?.maxScore ?? null;
        case "selection_count":
          return Array.isArray(raw) ? raw.length : 0;
        default:
          return null;
      }
    }

    case "calc_ref":
      if (!ctx.resolvedCalcs.has(node.calcId)) return null;
      return ctx.resolvedCalcs.get(node.calcId) ?? null;

    case "binary_op": {
      const l = evaluateCalcExpression(node.left, ctx);
      const r = evaluateCalcExpression(node.right, ctx);
      if (l === null || r === null) return null;
      switch (node.operator) {
        case "+":
          return l + r;
        case "-":
          return l - r;
        case "*":
          return l * r;
        case "/":
          return r === 0 ? null : l / r;
        case "%":
          return r === 0 ? null : l % r;
        case "**": {
          const res = Math.pow(l, r);
          return isNaN(res) || !isFinite(res) ? null : res;
        }
        default:
          return null;
      }
    }

    case "unary_op": {
      const v = evaluateCalcExpression(node.operand, ctx);
      if (v === null) return null;
      switch (node.operator) {
        case "negate":
          return -v;
        case "abs":
          return Math.abs(v);
        case "floor":
          return Math.floor(v);
        case "ceil":
          return Math.ceil(v);
        case "round":
          return Math.round(v);
        case "sqrt":
          return v < 0 ? null : Math.sqrt(v);
        default:
          return null;
      }
    }

    case "conditional": {
      const lv = evaluateCalcExpression(node.condition.left, ctx);
      const rv = evaluateCalcExpression(node.condition.right, ctx);
      if (lv === null || rv === null) return null;
      let met = false;
      switch (node.condition.operator) {
        case ">":
          met = lv > rv;
          break;
        case ">=":
          met = lv >= rv;
          break;
        case "<":
          met = lv < rv;
          break;
        case "<=":
          met = lv <= rv;
          break;
        case "==":
          met = lv === rv;
          break;
        case "!=":
          met = lv !== rv;
          break;
        default:
          met = false;
      }
      return evaluateCalcExpression(
        met ? node.consequent : node.alternate,
        ctx,
      );
    }
  }
}

// ── Formatter ─────────────────────────────────────────────────────────────────

function formatCalcEntry(
  variable: CalcVariable,
  rawValue: number | null,
): CalcResultEntry {
  if (rawValue === null) {
    return { value: null, formatted: variable.error_fallback ?? "" };
  }
  const { display } = variable;
  const n = rawValue * (display.multiplier ?? 1);
  let formattedNumber: string;
  try {
    formattedNumber = new Intl.NumberFormat(display.locale ?? "en-US", {
      style: display.format === "currency" ? "currency" : "decimal",
      ...(display.format === "currency" && display.currency_code
        ? { currency: display.currency_code }
        : {}),
      minimumFractionDigits: display.decimal_places ?? 0,
      maximumFractionDigits:
        display.decimal_places ?? (display.format === "integer" ? 0 : 2),
    }).format(n);
  } catch {
    formattedNumber = String(display.format === "integer" ? Math.round(n) : n);
  }
  return {
    value: rawValue,
    formatted: `${display.prefix ?? ""}${formattedNumber}${display.suffix ?? ""}`,
  };
}

// ── Public orchestrator ───────────────────────────────────────────────────────

/**
 * Evaluates all `calculations.variables` in a funnel schema against the
 * current answer state. Returns {} when no calculations are defined
 * (zero regression for funnels without a calculations block).
 *
 * Called from resolveToResult() alongside computeFunnelScore().
 */
export function calculateVariables(
  schema: funnelPayloadSchema,
  answers: FunnelAnswers,
): CalcResults {
  const { calculations } = schema;
  if (!calculations?.variables?.length) return {};

  const sectionScoreIndex = buildSectionScoreIndex(schema);
  const resolvedCalcs = new Map<string, number | null>();
  const results: CalcResults = {};

  const { sorted, cycleIds } = topologicalSortCalcVars(calculations.variables);

  for (const cycleId of cycleIds) {
    const variable = calculations.variables.find((v) => v.id === cycleId);
    console.error(
      `[CalcEngine] Circular dependency: variable "${cycleId}" cannot be evaluated.`,
    );
    results[cycleId] = {
      value: null,
      formatted: variable?.error_fallback ?? "",
      error: "CircularDependency",
    };
    resolvedCalcs.set(cycleId, null);
  }

  const ctx: EvaluationContext = { answers, sectionScoreIndex, resolvedCalcs };

  for (const variable of sorted) {
    const rawValue = evaluateCalcExpression(variable.expression, ctx);
    resolvedCalcs.set(variable.id, rawValue);
    results[variable.id] = formatCalcEntry(variable, rawValue);
  }

  return results;
}
