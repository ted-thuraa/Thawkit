import {
  funnelPayloadSchema,
  FunnelScoreResult,
  LeadData,
} from "@/types/PageCMS/pageSchema";
import {
  CategoryVariable,
  GlobalVariables,
  PersonalizationContext,
  QuestionVariable,
} from "./types";

/**
 * Derives a PersonalizationContext from already-computed scoring output.
 *
 * Pure and store-free by design (same convention as computeFunnelScore in
 * stores/funnelStore/helpers.ts) — it does NOT recompute any score. It only
 * reshapes `scoreResult.questionScores` / `scoreResult.categoryScores` (the
 * single source of truth, produced once by computeFunnelScore at submission
 * time) into O(1)-lookup Maps plus the three derived Global Variables.
 */
export function buildPersonalizationContext(
  schema: funnelPayloadSchema | null,
  scoreResult: FunnelScoreResult | null,
  leadData: LeadData,
): PersonalizationContext {
  const questions = new Map<string, QuestionVariable>();
  const categories = new Map<string, CategoryVariable>();

  if (!schema || !scoreResult) {
    return {
      questions,
      categories,
      global: {
        highestCategory: null,
        lowestCategory: null,
        totalQuestions: 0,
      },
      lead: leadData,
    };
  }

  for (const q of scoreResult.questionScores) {
    questions.set(q.sectionId, {
      sectionId: q.sectionId,
      title: q.title,
      answerLabel: q.answerLabel,
      score: q.earnedPoints,
      maxScore: q.maxPoints,
    });
  }

  for (const c of scoreResult.categoryScores) {
    categories.set(c.categoryId, {
      categoryId: c.categoryId,
      title: c.categoryTitle,
      value: c.earnedPoints,
      maxValue: c.maxPoints,
      percentage: c.score,
      tier: c.tier,
    });
  }

  // Single linear pass over the (small, bounded) category set — highest and
  // lowest are derived directly, no sort required.
  let highestCategory: CategoryVariable | null = null;
  let lowestCategory: CategoryVariable | null = null;
  for (const cat of categories.values()) {
    if (!highestCategory || cat.percentage > highestCategory.percentage) {
      highestCategory = cat;
    }
    if (!lowestCategory || cat.percentage < lowestCategory.percentage) {
      lowestCategory = cat;
    }
  }

  const global: GlobalVariables = {
    highestCategory,
    lowestCategory,
    totalQuestions: scoreResult.questionScores.length,
  };

  return { questions, categories, global, lead: leadData };
}
