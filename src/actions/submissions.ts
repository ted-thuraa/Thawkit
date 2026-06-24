"use server";

import { db } from "@/drizzle/db";
import {
  projectQuizFields,
  projects,
  quizAnswers,
  quizFieldCategories,
  quizFieldOptions,
  quizResponses,
  scores,
} from "@/drizzle/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { v4 } from "uuid";

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

export interface ProjectInputResponse {
  projectId: string;
  quizResponseId?: string;
  answers: {
    questionId: string;
    option_id: string | string[];
    answer?: string;
    time_spent: number;
  }[];
  duration?: number;
}

interface ScoringRule {
  score: number;
  option_id: string;
  category_id?: string;
}

// Redirect Logic Interfaces
export interface QuizRedirectLogic {
  strategy: "DEFAULT" | "SCORE_TIER" | "OUTCOME";
  config: {
    default: {
      resultPageId: string | undefined;
    };
    scoreTier: {
      fallbackPageId: string | undefined;
      mappings: {
        tierId: string;
        resultPageId: string | undefined;
      }[];
    };
    outcome: {
      scoringDirection: "HIGHEST" | "LOWEST";
      fallbackPageId: string | undefined;
      mappings: {
        categoryId: string;
        resultPageId: string | undefined;
      }[];
    };
  };
}

export type ScoreInsert = typeof scores.$inferInsert;

export interface QuizSubmissionResult {
  success: true;
  quizResponseId: string;
  overallScore: number;
  overallPercentage: number;
  tier: any;
  scores: ScoreInsert[];
  resultPageId?: string; // Added field for redirection
}

export interface QuizSubmissionError {
  success: false;
  error: string;
}

export type QuizResponseOutcome = QuizSubmissionResult | QuizSubmissionError;

export interface LeadSubmissionInput {
  projectId: string;
  leadData: Record<string, any>;
  existingResponseId?: string;
}

export interface LeadSubmissionResult {
  success: boolean;
  funnelLeadId?: string;
  quizResponseId?: string;
  error?: string;
}

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

const safeParse = <T>(data: string | null | undefined, fallback: T): T => {
  if (!data) return fallback;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return fallback;
  }
};

const calculateTruePotentials = (
  allFields: (typeof projectQuizFields.$inferSelect)[],
  categories: (typeof quizFieldCategories.$inferSelect)[]
) => {
  let overallPotential = 0;
  const categoryPotentials = new Map<string, number>();

  categories.forEach((cat) => categoryPotentials.set(cat.id, 0));

  for (const field of allFields) {
    const scoringRules = safeParse<ScoringRule[]>(field.scoring, []);
    let maxFieldScore = 0;

    if (scoringRules.length > 0) {
      maxFieldScore = Math.max(
        ...scoringRules.map((s) => Number(s.score || 0))
      );
    }

    overallPotential += maxFieldScore;

    const fieldCats = safeParse<string[]>(field.categoryIds, []);
    const ruleCats = scoringRules
      .map((s) => s.category_id)
      .filter((id): id is string => !!id);

    const uniqueCatIds = new Set([...fieldCats, ...ruleCats]);

    uniqueCatIds.forEach((catId) => {
      if (categoryPotentials.has(catId)) {
        const current = categoryPotentials.get(catId) || 0;
        categoryPotentials.set(catId, current + maxFieldScore);
      }
    });
  }

  return { overallPotential, categoryPotentials };
};

// ----------------------------------------------------------------------
// 1. Submit Lead Action
// ----------------------------------------------------------------------

export const submitLead = async (
  input: LeadSubmissionInput
): Promise<LeadSubmissionResult> => {
  console.log(" 🔹  Submitting Lead for Project:", input.projectId);

  try {
    return await db.transaction(async (tx) => {
      const now = new Date();
      let quizResponseId = input.existingResponseId;

      if (quizResponseId) {
        // Update existing response
        await tx
          .update(quizResponses)
          .set({ leadData: input.leadData, updatedAt: now })
          .where(eq(quizResponses.id, quizResponseId));
      } else {
        // Create new response
        quizResponseId = v4();
        await tx.insert(quizResponses).values({
          id: quizResponseId,
          projectId: input.projectId,
          leadData: input.leadData,
          startedAt: now,
          status: "RECEIVED",
          // FIX: Initialize numeric fields to 0 to satisfy potential DB NOT NULL constraints
          overallScore: 0,
          duration: 0,
        });
      }

      return {
        success: true,
        quizResponseId,
      };
    });
  } catch (error) {
    console.error(" ❌  Error submitting lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save lead",
    };
  }
};

// ----------------------------------------------------------------------
// 2. Submit Quiz Response Action (UPDATED with Redirection Logic)
// ----------------------------------------------------------------------

export const submitQuizResponse = async (
  input: ProjectInputResponse
): Promise<QuizResponseOutcome> => {
  console.log(" 🔹  Submitting Quiz Response for Project:", input.projectId);

  try {
    // 1. Fetch Context (Read-only, can be outside transaction for performance)
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, input.projectId),
      with: {
        scoreTiers: true,
        quizFieldCategories: true,
        projectQuizFields: {
          with: {
            quizFieldOptions: true,
          },
        },
      },
    });

    if (!project) throw new Error("Project not found");

    // 2. Map Optimization
    const fieldsMap = new Map(project.projectQuizFields.map((f) => [f.id, f]));
    const optionsMap = new Map<string, typeof quizFieldOptions.$inferSelect>();
    project.projectQuizFields.forEach((f) => {
      f.quizFieldOptions.forEach((o) => optionsMap.set(o.id, o));
    });

    // 3. Calculate Potentials
    const { overallPotential, categoryPotentials } = calculateTruePotentials(
      project.projectQuizFields,
      project.quizFieldCategories
    );

    // 4. Calculate Scores (In Memory BEFORE DB Write)
    // We do this here so we can insert the final score immediately in the transaction
    const answerInsertData: (typeof quizAnswers.$inferInsert)[] = [];
    let userOverallScore = 0;
    const userCategoryScores = new Map<string, number>();
    const userCategoryTime = new Map<string, number>();

    project.quizFieldCategories.forEach((c) => {
      userCategoryScores.set(c.id, 0);
      userCategoryTime.set(c.id, 0);
    });

    // Use the ID from input or generate a new one now for binding answers
    const finalQuizResponseId = input.quizResponseId || v4();

    for (const ans of input.answers) {
      const field = fieldsMap.get(ans.questionId);
      if (!field) continue;

      const optionIds = Array.isArray(ans.option_id)
        ? ans.option_id
        : [ans.option_id];

      const scoringRules = safeParse<ScoringRule[]>(field.scoring, []);
      const maxFieldScore =
        scoringRules.length > 0
          ? Math.max(...scoringRules.map((s) => Number(s.score || 0)))
          : 0;

      for (const optId of optionIds) {
        const rule = scoringRules.find((s) => s.option_id === optId);
        const scoreValue = rule ? Number(rule.score) : 0;
        const optionObj = optionsMap.get(optId);
        const answerText = ans.answer || optionObj?.label || "";

        userOverallScore += scoreValue;

        const ruleCategoryId = rule?.category_id;
        const fieldCategoryIds = safeParse<string[]>(field.categoryIds, []);
        const targetCategoryIds = new Set<string>();

        if (ruleCategoryId) targetCategoryIds.add(ruleCategoryId);
        fieldCategoryIds.forEach((id) => targetCategoryIds.add(id));

        targetCategoryIds.forEach((catId) => {
          if (userCategoryScores.has(catId)) {
            const currentScore = userCategoryScores.get(catId) || 0;
            userCategoryScores.set(catId, currentScore + scoreValue);
            const currentTime = userCategoryTime.get(catId) || 0;
            userCategoryTime.set(catId, currentTime + ans.time_spent);
          }
        });

        answerInsertData.push({
          id: v4(),
          quizResponseId: finalQuizResponseId,
          projectQuizFieldId: field.id,
          optionId: optId,
          answer: answerText,
          score: scoreValue,
          scorePotential: maxFieldScore.toString(),
          timeSpent: ans.time_spent,
        });
      }
    }

    // 5. Prepare Scores Data
    const scoreInsertData: (typeof scores.$inferInsert)[] = [];

    const findTier = (percentage: number) => {
      return project.scoreTiers.find(
        (t) => percentage >= t.scoreFrom && percentage <= t.scoreTo
      );
    };

    project.quizFieldCategories.forEach((cat) => {
      const userScore = userCategoryScores.get(cat.id) || 0;
      const potential = categoryPotentials.get(cat.id) || 0;
      const time = userCategoryTime.get(cat.id) || 0;
      const percentage =
        potential > 0 ? Math.round((userScore / potential) * 100) : 0;
      const tier = findTier(percentage);

      scoreInsertData.push({
        id: v4(),
        quizResponseId: finalQuizResponseId,
        categoryId: cat.id,
        type: "category",
        score: userScore.toString(),
        scorePotential: potential.toString(),
        scorePercentage: percentage.toString(),
        timeSpent: time,
        scoreTierId: tier?.id || null,
      });
    });

    const overallPercentage =
      overallPotential > 0
        ? Math.round((userOverallScore / overallPotential) * 100)
        : 0;
    const overallTier = findTier(overallPercentage);

    scoreInsertData.push({
      id: v4(),
      quizResponseId: finalQuizResponseId,
      categoryId: null,
      type: "quizOverall",
      score: userOverallScore.toString(),
      scorePotential: overallPotential.toString(),
      scorePercentage: overallPercentage.toString(),
      timeSpent: input.duration || 0,
      scoreTierId: overallTier?.id || null,
    });

    // 6. Execute Database Writes (Atomic Transaction)
    await db.transaction(async (tx) => {
      const now = new Date();

      if (input.quizResponseId) {
        // Update existing
        await tx
          .update(quizResponses)
          .set({
            completedAt: now,
            duration: input.duration,
            updatedAt: now,
            status: "COMPLETED",
            overallScore: userOverallScore, // Update score directly
          })
          .where(eq(quizResponses.id, finalQuizResponseId));
      } else {
        // Insert new
        await tx.insert(quizResponses).values({
          id: finalQuizResponseId,
          projectId: input.projectId,
          startedAt: now,
          completedAt: now,
          duration: input.duration,
          status: "COMPLETED",
          overallScore: userOverallScore, // Insert score directly
        });
      }

      // Insert Answers
      if (answerInsertData.length > 0) {
        await tx.insert(quizAnswers).values(answerInsertData);
      }

      // Insert Scores
      if (scoreInsertData.length > 0) {
        await tx.insert(scores).values(scoreInsertData);
      }
    });

    // 7. Redirect Logic (Same as before)
    const projectSettings = project.settings ? (project.settings as any) : {};
    const redirectLogic = projectSettings.quizRedirectLogic as
      | QuizRedirectLogic
      | undefined;

    let finalResultPageId: string | undefined = undefined;

    if (redirectLogic) {
      const { strategy, config } = redirectLogic;

      if (strategy === "DEFAULT") {
        finalResultPageId = config.default.resultPageId;
      } else if (strategy === "SCORE_TIER") {
        const tierId = overallTier?.id;
        const mappings = config.scoreTier.mappings;

        if (tierId) {
          const matchedMapping = mappings.find((m) => m.tierId === tierId);
          finalResultPageId = matchedMapping?.resultPageId;
        }
        if (!finalResultPageId) {
          finalResultPageId = config.scoreTier.fallbackPageId;
        }
      } else if (strategy === "OUTCOME") {
        const direction = config.outcome.scoringDirection;
        const catScores = Array.from(userCategoryScores.entries()).map(
          ([id, val]) => ({ id, val })
        );

        if (direction === "HIGHEST") {
          catScores.sort((a, b) => b.val - a.val);
        } else {
          catScores.sort((a, b) => a.val - b.val);
        }

        const outcomeCategoryId = catScores[0]?.id;
        const mappings = config.outcome.mappings;

        if (outcomeCategoryId) {
          const matchedMapping = mappings.find(
            (m) => m.categoryId === outcomeCategoryId
          );
          finalResultPageId = matchedMapping?.resultPageId;
        }
        if (!finalResultPageId) {
          finalResultPageId = config.outcome.fallbackPageId;
        }
      }
    }

    console.log(
      " ✅  Quiz Processed. ID:",
      finalQuizResponseId,
      "Redirecting to:",
      finalResultPageId
    );

    return {
      success: true,
      quizResponseId: finalQuizResponseId,
      overallScore: userOverallScore,
      overallPercentage,
      tier: overallTier,
      scores: scoreInsertData,
      resultPageId: finalResultPageId,
    };
  } catch (error) {
    console.error(" ❌  Error processing quiz response:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown server error",
    };
  }
};
