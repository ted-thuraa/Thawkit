import {
  BranchCondition,
  FunnelAnswers,
  BranchPredicate,
  PageSection,
  Quiz1Content,
  QuizOptions,
  QuestionCategory,
  QuestionType,
  QuizAnswer,
  CategoryScoreResult,
  QuestionScoreResult,
  FunnelScoreResult,
  ScoreTier,
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
      const selected =
        (answers[condition.sectionId] as string[] | undefined) ?? [];
      return condition.optionIds.some((id) => selected.includes(id));
    }
    case "option_not_selected": {
      const selected =
        (answers[condition.sectionId] as string[] | undefined) ?? [];
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

// ─── Score tiers ─────────────────────────────────────────────────────────────

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

    const content = section.content as Quiz1Content;
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
      const content = section.content as Quiz1Content;
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
