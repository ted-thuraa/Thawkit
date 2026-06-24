import { QuestionCategories } from "../types/project";

type ScoreTiers = {
  name: string;
  id: string;
  score_colour: string;
  score_from: number;
  score_to: number;
};
// --- Constants ---
export const DEFAULT_TIER_COLOR = "#cccccc"; // Default color if tier or color is missing

// --- Type Definitions ---
// Re-export or redefine if not globally accessible
export type { ScoreTiers };

// --- Helper Functions ---

/**
 * Finds the specific score tier that a given score falls into.
 * @param score - The score percentage (0-100).
 * @param tiers - An array of ScoreTiers objects.
 * @returns The matching ScoreTier object or null if no match or invalid tiers.
 */
export const findScoreTierForScore = (
  score: number,
  tiers: ScoreTiers[] | null | undefined
): ScoreTiers | null => {
  if (!tiers || tiers.length === 0) {
    return null;
  }
  // Ensure tiers are sorted by score_from just in case
  const sortedTiers = [...tiers].sort((a, b) => a.score_from - b.score_from);

  return (
    sortedTiers.find(
      (tier) => score >= tier.score_from && score <= tier.score_to
    ) || null
  );
};

/**
 * Gets the color for a specific score tier, with a fallback.
 * @param tier - The ScoreTier object.
 * @returns The tier's color (hex) or a default color.
 */
export const getTierColor = (tier: ScoreTiers | null): string => {
  return tier?.score_colour || DEFAULT_TIER_COLOR;
};

/**
 * Calculates the overall range covered by the score tiers.
 * @param tiers - An array of ScoreTiers objects.
 * @returns An object with min and max scores, or null if no valid tiers.
 */
export const getTiersRange = (
  tiers: ScoreTiers[] | null | undefined
): { min: number; max: number } | null => {
  if (!tiers || tiers.length === 0) {
    return null;
  }
  const min = Math.min(...tiers.map((t) => t.score_from));
  const max = Math.max(...tiers.map((t) => t.score_to));
  if (min === Infinity || max === -Infinity) {
    return null;
  }
  return { min, max };
};

/**
 * Calculates the percentage position of a score within the total range of tiers.
 * Ensures the position stays within 0-100%.
 * @param score - The score percentage (0-100).
 * @param tiers - An array of ScoreTiers objects.
 * @returns The position as a percentage (0-100), or 0 if tiers are invalid.
 */
export const calculateScorePositionPercentage = (
  score: number | null | undefined,
  tiers: ScoreTiers[] | null | undefined
): number => {
  const range = getTiersRange(tiers);
  if (
    score === null ||
    score === undefined ||
    !range ||
    range.max === range.min
  ) {
    return 0; // Cannot determine position
  }

  const clampedScore = Math.max(range.min, Math.min(score, range.max));
  const percentage =
    ((clampedScore - range.min) / (range.max - range.min)) * 100;

  // Clamp percentage between 0 and 100
  return Math.max(0, Math.min(percentage, 100));
};

/**
 * Calculates the width percentage for each tier segment based on its range.
 * @param tiers - An array of ScoreTiers objects.
 * @returns An array of objects containing the tier and its width percentage.
 */
export const calculateTierSegmentWidths = (
  tiers: ScoreTiers[] | null | undefined
): { tier: ScoreTiers; width: number }[] => {
  const range = getTiersRange(tiers);
  if (!range || range.max === range.min || !tiers || tiers.length === 0) {
    return [];
  }

  const totalRange = range.max - range.min;
  // Ensure tiers are sorted for correct segment calculation
  const sortedTiers = [...tiers].sort((a, b) => a.score_from - b.score_from);

  return sortedTiers.map((tier) => {
    const tierRange = tier.score_to - tier.score_from;
    const width = (tierRange / totalRange) * 100;
    return { tier, width: Math.max(0, width) }; // Ensure width is not negative
  });
};

// --- Hardcoded Level/Info (Example for Input Mode - Adapt if needed) ---
// You might keep these or adapt them if your 'input' mode needs fixed levels
export type LevelType = "low" | "normal" | "medium" | "high";
export const levelValues: LevelType[] = ["low", "normal", "medium", "high"];

export const getLevelInfo = (level: LevelType) => {
  const info = {
    low: { title: "LOW level", description: "Description for low." },
    normal: { title: "NORMAL level", description: "Description for normal." },
    medium: { title: "MEDIUM level", description: "Description for medium." },
    high: { title: "HIGH level", description: "Description for high." },
  };
  return info[level];
};

export type NivoChartDataItem = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type OverallScoreData = {
  id: string;
  categoryId: string | null;
  scoreTierId: string;
  scoreTierColor: string;
  score: string;
  score_potential: string;
  score_percentage: string;
  time_spent: number;
  type: string;
  resultId: string;
  createdAt: string;
  updatedAt: string;
  category: string | null;
};

// --- Helper Functions ---

// ... existing code ...

/**
 * Prepares chart data for Nivo Pie Chart from categories.
 * @param categories - An array of QuestionCategory objects.
 * @returns An array of NivoChartDataItem.
 */
export const prepareNivoPieChartData = (
  categories: QuestionCategories[] | undefined
): NivoChartDataItem[] => {
  if (!categories) return [];

  return categories.map((item) => ({
    id: item.title as string,
    label: item.title as string,
    value: parseFloat((Math.random() * 100).toFixed(2)), // Keeps existing random generation
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Keeps existing random color
  }));
};

/**
 * Provides a sample overall score data object.
 * In a real application, this would likely be fetched or calculated.
 * @returns A sample OverallScoreData object.
 */
export const getSampleOverallScoreData = (): OverallScoreData => {
  return {
    id: "037235e3-e159-4277-96ed-879883da2598",
    categoryId: null,
    scoreTierId: "dcc9c272-7ff7-4aaa-b427-de9bc094a3f8",
    scoreTierColor: "#4117d9",
    score: "7",
    score_potential: "13",
    score_percentage: "54.00", // This is the important part for the chart display
    time_spent: 0,
    type: "quizOverall",
    resultId: "0485bf10-0791-4d90-b571-8fbc6d405cd5",
    createdAt: "2025-02-13T09:30:12.893Z",
    updatedAt: "2025-02-13T09:30:12.893Z",
    category: null,
  };
};

export type DynamicScoreInfo = {
  percentage: number;
  tier: ScoreTiers | null;
};

/**
 * Generates a dynamic score percentage and identifies the corresponding score tier.
 * - If selectedTierId is provided, generates a score within that tier's range.
 * - If selectedTierId is null, generates a score within the overall range of all tiers
 *   and then identifies which tier that score falls into.
 * @param selectedTierId - The ID of the currently selected tier, or null.
 * @param tiers - An array of ScoreTiers objects.
 * @returns An object containing the calculated `percentage` and the corresponding `tier` object.
 */
export const generateDynamicScoreInfo = (
  selectedTierId: string | null,
  tiers: ScoreTiers[] | null | undefined
): DynamicScoreInfo => {
  const getRandomInRange = (min: number, max: number): number => {
    if (min > max) {
      // Ensure min is not greater than max for generation
      // If min > max (e.g. single point tier from=50, to=50), just return min
      if (min === max) return min;
      // Otherwise, swap for random generation logic
      [min, max] = [max, min];
    }
    if (min === max) return min; // Handle cases where tier is a single point.
    return Math.random() * (max - min) + min;
  };

  if (!tiers || tiers.length === 0) {
    const randomPercentage = getRandomInRange(0, 100);
    return { percentage: Math.round(randomPercentage), tier: null };
  }

  let calculatedPercentage: number;
  let selectedTier: ScoreTiers | null = null;

  if (selectedTierId) {
    selectedTier = tiers.find((t) => t.id === selectedTierId) || null;
  }

  if (selectedTier) {
    // A specific tier is selected, generate a score within it
    calculatedPercentage = getRandomInRange(
      selectedTier.score_from,
      selectedTier.score_to
    );
  } else {
    // No specific tier, generate from the overall range of all tiers
    const overallRange = getTiersRange(tiers);
    calculatedPercentage =
      overallRange &&
      isFinite(overallRange.min) &&
      isFinite(overallRange.max) &&
      overallRange.max >= overallRange.min
        ? getRandomInRange(overallRange.min, overallRange.max)
        : getRandomInRange(0, 100);
  }

  // Clamp the generated score to be within 0-100 and round it.
  const finalPercentage = Math.round(
    Math.max(0, Math.min(calculatedPercentage, 100))
  );

  // Find the tier that corresponds to the final rounded percentage.
  const finalTier = findScoreTierForScore(finalPercentage, tiers);

  return { percentage: finalPercentage, tier: finalTier };
};

const sampleCategoriesForGeneration = [
  {
    categoryId: "1668f6fa-7574-49a0-aadd-081810459b4e",
    categoryTitle: "marketing skill",
  },
  {
    categoryId: "6397a3cb-bc86-4fe9-8cde-e44fef2abcb3",
    categoryTitle: "Marketing Strategy",
  },
  {
    categoryId: "815c4053-1147-43c3-bd66-a60e0afc4d21",
    categoryTitle: "marketing direction",
  },
  {
    categoryId: "86bf5091-5758-48a8-8453-4d188352cd48",
    categoryTitle: "marketing angle",
  },
  {
    categoryId: "f9069268-968d-45e6-bdad-46a3c8623242",
    categoryTitle: "Marketing content",
  },
];

type GeneratedCategoryScore = {
  categoryId: string;
  categoryTitle: string;
  scoreTierId: string;
  score_percentage: string;
  scoreTierColor: string;
  scoreTierName: string;
};

type GeneratedOverallScore = {
  scoreTierId: string;
  scoreTierColor: string;
  score_percentage: string;
};

type GeneratedSampleData = {
  scoreTierId: string;
  data: {
    overallScore: GeneratedOverallScore;
    categoryScores: GeneratedCategoryScore[];
  };
};

const getRandomScoreInRange = (min: number, max: number): string => {
  const score = Math.random() * (max - min) + min;
  return score.toFixed(2);
};

export const generateSampleDataFromTiers = (
  tiers: (ScoreTiers & { name: string })[],
  categories: QuestionCategories[]
): GeneratedSampleData[] => {
  if (!tiers || tiers.length === 0 || !categories || categories.length === 0) {
    return [];
  }

  const categoryData = categories.map((cat) => ({
    categoryId: cat.id,
    categoryTitle: cat.title as string,
  }));

  return tiers.map((tier) => {
    const categoryScores = categoryData.map((category) => ({
      ...category,
      scoreTierId: tier.id,
      score_percentage: getRandomScoreInRange(tier.score_from, tier.score_to),
      scoreTierColor: tier.score_colour,
      scoreTierName: tier.name,
    }));

    return {
      scoreTierId: tier.id,
      data: {
        overallScore: {
          scoreTierId: tier.id,
          scoreTierColor: tier.score_colour,
          score_percentage: getRandomScoreInRange(
            tier.score_from,
            tier.score_to
          ),
        },
        categoryScores,
      },
    };
  });
};

const sampleScoretiers = [
  {
    id: "a2216e3b-2728-41b2-a357-44f49e68bf5a",
    name: "weakest",
    score_colour: "#92e161",
    score_from: 0,
    score_to: 33,
    toolId: "b3b79b81-040f-4e13-a9ca-3ac93fffe1c5",
    createdAt: "2025-06-06T17:43:20.538Z",
    updatedAt: "2025-06-06T17:43:20.538Z",
  },
  {
    id: "0907c15b-4dc8-421f-8054-270bedef8e6f",
    name: "balanced",
    score_colour: "#40b43a",
    score_from: 34,
    score_to: 66,
    toolId: "b3b79b81-040f-4e13-a9ca-3ac93fffe1c5",
    createdAt: "2025-06-06T17:43:20.538Z",
    updatedAt: "2025-06-06T17:43:20.538Z",
  },
  {
    id: "582b774d-7cbf-4fba-ad62-fc7615b66899",
    name: "strongest",
    score_colour: "#23810b",
    score_from: 67,
    score_to: 100,
    toolId: "b3b79b81-040f-4e13-a9ca-3ac93fffe1c5",
    createdAt: "2025-06-06T17:43:20.538Z",
    updatedAt: "2025-06-06T17:43:20.538Z",
  },
];

const mappedSampleCategories = sampleCategoriesForGeneration.map((c) => ({
  id: c.categoryId,
  title: c.categoryTitle,
}));

// export const sampleData = generateSampleDataFromTiers(
//   sampleScoretiers,
//   mappedSampleCategories
// );
