import { v4 as uuidv4 } from "uuid";

// ----------------------------------------------------------------------
// 1. Types (Based on your schema + Simulator needs)
// ----------------------------------------------------------------------

type ScoreTier = {
  id: string;
  name: string;
  scoreColour: string;
  scoreFrom: number;
  scoreTo: number;
  projectId: string;
};

type Category = {
  id: string;
  title: string;
};

type QuestionOption = {
  id: string;
  label: string;
};

type ScoringRule = {
  id: string;
  field_Id: string;
  category_id?: string;
  option_id?: string; // string | null in your data, but logic relies on it matching an option
  score: number;
};

type Question = {
  id: string;
  title: string;
  options: QuestionOption[];
  categoryIds: string[]; // Field-level category tags
  scoring: ScoringRule[];
};

// The Output Structure you requested
export type GeneratedSampleData = {
  scoreTierId: string;
  data: {
    overallScore: {
      scoreTierId: string;
      scoreTierName: string;
      scoreTierColor: string;
      score_percentage: string;
      currentScore: number;
      potentialScore: number;
    };
    categoryScores: {
      categoryId: string;
      categoryTitle: string;
      scoreTierId: string | null;
      score_percentage: string;
      scoreTierColor: string;
      scoreTierName: string;
      currentScore: number;
      potentialScore: number;
    }[];
  };
};

// ----------------------------------------------------------------------
// 2. Helper Classes & Functions
// ----------------------------------------------------------------------

/**
 * Calculates the max potential score for the entire quiz and per category.
 * This is crucial to know what the denominator is.
 */
const calculatePotentials = (questions: Question[], categories: Category[]) => {
  let overallPotential = 0;
  const categoryPotentials = new Map<string, number>();

  // Initialize categories
  categories.forEach((c) => categoryPotentials.set(c.id, 0));

  questions.forEach((q) => {
    // 1. Find max score for this question (Overall Potential)
    const maxQuestionScore =
      q.scoring.length > 0
        ? Math.max(...q.scoring.map((s) => Number(s.score || 0)))
        : 0;

    overallPotential += maxQuestionScore;

    // 2. Add this potential to relevant categories
    // A question contributes to a category if it's tagged in `categoryIds`
    // OR if a specific scoring rule points to that category.
    const uniqueCatIds = new Set<string>();

    // Check field-level tags
    (q.categoryIds || []).forEach((id) => uniqueCatIds.add(id));

    // Check rule-level tags
    q.scoring.forEach((s) => {
      if (s.category_id && s.category_id !== "overall_score") {
        uniqueCatIds.add(s.category_id);
      }
    });

    uniqueCatIds.forEach((catId) => {
      if (categoryPotentials.has(catId)) {
        categoryPotentials.set(
          catId,
          (categoryPotentials.get(catId) || 0) + maxQuestionScore
        );
      }
    });
  });

  return { overallPotential, categoryPotentials };
};

/**
 * Returns a specific Tier object based on a percentage.
 */
const getTierForPercentage = (percentage: number, tiers: ScoreTier[]) => {
  return (
    tiers.find((t) => percentage >= t.scoreFrom && percentage <= t.scoreTo) ||
    null
  );
};

// ----------------------------------------------------------------------
// 3. The Solver (Core Algorithm)
// ----------------------------------------------------------------------

/**
 * Generates a set of answers that mathematically results in a score
 * falling within the target Min and Max range.
 */
const solveAnswersForTargetScore = (
  questions: Question[],
  targetMin: number,
  targetMax: number
): Map<string, string> => {
  // Map<QuestionId, OptionId>
  const selectedOptions = new Map<string, string>();

  // Helper to calculate score of current selection
  const calculateCurrentScore = () => {
    let score = 0;
    selectedOptions.forEach((optId, qId) => {
      const q = questions.find((x) => x.id === qId);
      if (!q) return;
      const rule = q.scoring.find((s) => s.option_id === optId);
      score += rule ? Number(rule.score) : 0;
    });
    return score;
  };

  // 1. Initial Random Fill
  questions.forEach((q) => {
    if (q.options.length > 0) {
      const randomOpt = q.options[Math.floor(Math.random() * q.options.length)];
      selectedOptions.set(q.id, randomOpt.id);
    }
  });

  // 2. Iterative Optimization (Hill Climbing / Adjusting)
  // We try to nudge the score until it fits the window.
  let currentScore = calculateCurrentScore();
  let attempts = 0;
  const MAX_ATTEMPTS = 1000; // Guardrail against infinite loops

  while (
    (currentScore < targetMin || currentScore > targetMax) &&
    attempts < MAX_ATTEMPTS
  ) {
    attempts++;

    // We need to change the score.
    const needMorePoints = currentScore < targetMin;

    // Find a candidate question to swap
    // If we need more points: find a question where current choice < max possible choice
    // If we need fewer points: find a question where current choice > min possible choice
    const changeableQuestions = questions.filter((q) => {
      const currentOptId = selectedOptions.get(q.id);
      const currentRule = q.scoring.find((s) => s.option_id === currentOptId);
      const currentVal = currentRule ? Number(currentRule.score) : 0;

      const maxVal = Math.max(...q.scoring.map((s) => Number(s.score)), 0);
      const minVal = Math.min(...q.scoring.map((s) => Number(s.score)), 0);

      if (needMorePoints) return currentVal < maxVal;
      else return currentVal > minVal;
    });

    if (changeableQuestions.length === 0) break; // Cannot optimize further

    // Pick a random changeable question
    const qToSwap =
      changeableQuestions[
        Math.floor(Math.random() * changeableQuestions.length)
      ];
    const currentOptId = selectedOptions.get(qToSwap.id);

    // Find a better option for our goal
    const sortedRules = [...qToSwap.scoring].sort(
      (a, b) => Number(a.score) - Number(b.score)
    );
    let newOptId = currentOptId;

    if (needMorePoints) {
      // Pick the highest value option that is greater than current
      // (Simplified: just pick the max scoring option)
      const bestRule = sortedRules[sortedRules.length - 1];
      newOptId = bestRule.option_id || qToSwap.options[0].id;
    } else {
      // Pick the lowest value option
      const worstRule = sortedRules[0];
      newOptId = worstRule.option_id || qToSwap.options[0].id;
    }

    // Apply Swap
    if (newOptId) selectedOptions.set(qToSwap.id, newOptId);

    // Recalculate
    currentScore = calculateCurrentScore();
  }

  return selectedOptions;
};

// ----------------------------------------------------------------------
// 4. Main Generator Function
// ----------------------------------------------------------------------

export const generateQuizDummyData = (
  scoreTiers: ScoreTier[],
  questions: Question[],
  categories: Category[]
): GeneratedSampleData[] => {
  // A. Pre-calculate the "Universe" of points
  const { overallPotential, categoryPotentials } = calculatePotentials(
    questions,
    categories
  );

  const results: GeneratedSampleData[] = [];

  // B. Loop through every requested Score Tier and generate a result for it
  for (const tier of scoreTiers) {
    // 1. Determine Target Raw Score Range
    // e.g. Tier is 50-100%. Total Potential is 10. We need score between 5 and 10.
    const targetMin = Math.ceil((tier.scoreFrom / 100) * overallPotential);
    const targetMax = Math.floor((tier.scoreTo / 100) * overallPotential);

    // 2. Solve for Answers
    // Returns a map of QuestionID -> OptionID
    const selectedAnswers = solveAnswersForTargetScore(
      questions,
      targetMin,
      targetMax
    );

    // 3. Calculate Resulting Scores based on the selected answers
    let userOverallScore = 0;
    const userCategoryScores = new Map<string, number>();
    categories.forEach((c) => userCategoryScores.set(c.id, 0));

    selectedAnswers.forEach((optId, qId) => {
      const q = questions.find((x) => x.id === qId);
      if (!q) return;

      const rule = q.scoring.find((s) => s.option_id === optId);
      const scoreValue = rule ? Number(rule.score) : 0;

      // Add to overall
      userOverallScore += scoreValue;

      // Add to categories
      // Logic mirrors the server action: Check rule category first, then field categories
      const uniqueCats = new Set<string>();
      if (rule?.category_id) uniqueCats.add(rule.category_id);
      (q.categoryIds || []).forEach((cid) => uniqueCats.add(cid));

      uniqueCats.forEach((catId) => {
        if (userCategoryScores.has(catId)) {
          const prev = userCategoryScores.get(catId) || 0;
          userCategoryScores.set(catId, prev + scoreValue);
        }
      });
    });

    // 4. Compute Final Percentages
    const overallPercentage =
      overallPotential > 0
        ? Math.round((userOverallScore / overallPotential) * 100)
        : 0;

    // Safety: Ensure the simulated percentage actually matches the tier ID we are generating for.
    // (In edge cases with very few questions, mathematically we might land on boundary.
    // We strictly map the result to the tier it naturally falls into).
    const matchedOverallTier = getTierForPercentage(
      overallPercentage,
      scoreTiers
    );

    // 5. Build Category Output List
    const categoryOutputs = categories.map((cat) => {
      const catScore = userCategoryScores.get(cat.id) || 0;
      const catPotential = categoryPotentials.get(cat.id) || 0;
      const catPercent =
        catPotential > 0 ? Math.round((catScore / catPotential) * 100) : 0;
      const catTier = getTierForPercentage(catPercent, scoreTiers);

      return {
        categoryId: cat.id,
        categoryTitle: cat.title,
        scoreTierId: catTier?.id || null,
        scoreTierName: catTier?.name || "Unknown",
        scoreTierColor: catTier?.scoreColour || "#cccccc",
        score_percentage: catPercent.toString(),
        currentScore: catScore,
        potentialScore: catPotential,
      };
    });

    // 6. Push Final Object
    results.push({
      scoreTierId: tier.id, // The ID we *attempted* to generate for
      data: {
        overallScore: {
          scoreTierId: matchedOverallTier?.id || tier.id,
          scoreTierName: matchedOverallTier?.name || tier.name,
          scoreTierColor: matchedOverallTier?.scoreColour || tier.scoreColour,
          score_percentage: overallPercentage.toString(),
          currentScore: userOverallScore,
          potentialScore: overallPotential,
        },
        categoryScores: categoryOutputs,
      },
    });
  }

  return results;
};
