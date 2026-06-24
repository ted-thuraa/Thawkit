import { db } from "@/drizzle/db";
import {
  projectQuizFields,
  projects,
  quizAnswers,
  quizFieldCategories,
  quizFieldOptions,
  quizResponses,
  scores,
  funnelPages,
  funnels,
  scoreTiers,
} from "@/drizzle/schema";
import { eq, and, asc, desc, inArray } from "drizzle-orm";
import {
  ProjectModel,
  FormField,
  QuestionCategories,
  FinalFunnelPage,
  ScoreTiers,
} from "../types/project"; // Assumed import path for existing types

// --- New Result Data Types ---
export type OverallScore = {
  scoreTierId: string;
  scoreTierColor: string;
  score_percentage: string;
};

export type CategoryScore = {
  categoryId: string;
  categoryTitle: string;
  scoreTierId: string;
  score: string;
  score_potential: string;
  score_percentage: string;
  scoreTierColor: string;
  scoreTierName: string;
};

export type QuestionData = {
  id: string;
  title: string;
  QuizAnswers: {
    id: string;
    answer: string;
    option_id: string;
    score: number;
    time_spent: number;
  }[];
};

export type ResultPageData = {
  overallScore: OverallScore;
  categoryScores: CategoryScore[];
  questionsData: QuestionData[];
  highestCategoryScore: CategoryScore | null;
  lowestCategoryScore: CategoryScore | null;
};

// --- Updated Response Interface ---
export interface ProjectPublicDataMainPageResponse {
  projectData: {
    id: (typeof projects.$inferSelect)["id"];
    ref: (typeof projects.$inferSelect)["ref"];
    title: (typeof projects.$inferSelect)["title"];
    domain: (typeof projects.$inferSelect)["domain"];
    draftMode: (typeof projects.$inferSelect)["draftMode"];
    questionOrder: (typeof projects.$inferSelect)["questionOrder"];
    settings: (typeof projects.$inferSelect)["settings"];
    leadOptinForm: (typeof projects.$inferSelect)["leadOptinForm"];
  };
  formFields: FormField[];
  categories?: QuestionCategories[];
  funnelPages: FinalFunnelPage[];
  scoreTiersData?: ScoreTiers[];
  resultData?: ResultPageData; // Added for Result_Page context
  fetchedAt: number;
}

// Custom Error Class (Assumed exists based on context)
class QueryError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Redirect Logic Interfaces (Reused from previous context for clarity)
interface QuizRedirectLogic {
  strategy: "DEFAULT" | "SCORE_TIER" | "OUTCOME";
  config: {
    default: { resultPageId: string | undefined };
    scoreTier: {
      fallbackPageId: string | undefined;
      mappings: { tierId: string; resultPageId: string | undefined }[];
    };
    outcome: {
      scoringDirection: "HIGHEST" | "LOWEST";
      fallbackPageId: string | undefined;
      mappings: { categoryId: string; resultPageId: string | undefined }[];
    };
  };
}

/**
 * Fetches structured editor data for a project.
 * Handles Result Page calculation and dynamic page selection based on quiz scores.
 */
export async function fetchProjectPublicDataMainPage({
  domain,
  context,
  responseId,
}: {
  domain: string;
  context: "Landing_Page" | "Quiz_Page" | "Result_Page";
  responseId?: string;
}): Promise<ProjectPublicDataMainPageResponse> {
  // Validation
  if (!domain) {
    throw new QueryError(400, "domain is required.");
  }

  // For Result_Page, responseId is strictly required to calculate the outcome
  if (context === "Result_Page" && !responseId) {
    throw new QueryError(
      400,
      "responseId is required for Result Page context."
    );
  }

  try {
    const data = await db.transaction(async (tx) => {
      // ---------------------------------------------------------
      // A: Resolve project id from ref
      // ---------------------------------------------------------
      const projectRows = await tx
        .select({
          id: projects.id,
          ref: projects.ref,
          title: projects.title,
          domain: projects.domain,
          draftMode: projects.draftMode,
          questionOrder: projects.questionOrder,
          settings: projects.settings,
          leadOptinForm: projects.leadOptinForm,
        })
        .from(projects)
        .where(eq(projects.domain, domain))
        .limit(1);

      const project = projectRows[0];
      if (!project) {
        throw new QueryError(404, `Project with domain ${domain} not found.`);
      }
      const projectId = project.id;

      // ---------------------------------------------------------
      // B: Load form fields (Always needed for Q&A display or Quiz)
      // ---------------------------------------------------------
      // Note: If context is Result_Page, we usually still need question definitions to display "Your Answers"
      // We assume context "Result_Page" might want to show questions. If strictly not needed, we could optimize this out.
      const fieldsContext = context === "Result_Page" ? "Quiz_Page" : context;

      const formFieldsResult = await tx.query.projectQuizFields.findMany({
        where: and(
          eq(projectQuizFields.projectId, projectId),
          eq(projectQuizFields.context, fieldsContext)
        ),
        with: {
          quizFieldOptions: {
            columns: {
              id: true,
              order: true,
              label: true,
              projectQuizFieldId: true,
              mediaType: true,
              mediaSrc: true,
              showIcon: true,
            },
            orderBy: [asc(quizFieldOptions.order)],
          },
        },
        orderBy: [asc(projectQuizFields.order)],
      });

      let categoriesResult: QuestionCategories[] = [];
      let scoreTiersData: ScoreTiers[] = [];
      let resultData: ResultPageData | undefined = undefined;
      let targetPageId: string | undefined = undefined;

      // ---------------------------------------------------------
      // C: Context Specific Logic (Quiz & Result)
      // ---------------------------------------------------------

      // Load Categories & Score Tiers if not Landing Page
      if (context !== "Landing_Page") {
        categoriesResult = await tx
          .select()
          .from(quizFieldCategories)
          .where(eq(quizFieldCategories.projectId, projectId))
          .orderBy(asc(quizFieldCategories.order));

        scoreTiersData = await tx
          .select()
          .from(scoreTiers)
          .where(eq(scoreTiers.projectId, projectId));
      }

      // ---------------------------------------------------------
      // D: Result Page Specific Calculation
      // ---------------------------------------------------------
      if (context === "Result_Page" && responseId) {
        // 1. Fetch Response & Scores
        const quizResponse = await tx.query.quizResponses.findFirst({
          where: eq(quizResponses.id, responseId),
          with: {
            scores: true,
            quizAnswers: true,
          },
        });

        if (!quizResponse) {
          throw new QueryError(404, "Quiz Response not found.");
        }

        // 2. Prepare Data Structure for ResultData

        // Helper maps
        const tierMap = new Map(scoreTiersData.map((t) => [t.id, t]));
        const categoryMap = new Map(categoriesResult.map((c) => [c.id, c]));

        // a. Overall Score
        const overallScoreRecord = quizResponse.scores.find(
          (s) => s.type === "quizOverall"
        );
        const overallTier = overallScoreRecord?.scoreTierId
          ? tierMap.get(overallScoreRecord.scoreTierId)
          : null;

        const overallScore: OverallScore = {
          scoreTierId: overallScoreRecord?.scoreTierId || "",
          scoreTierColor: overallTier?.scoreColour || "",
          score_percentage: overallScoreRecord?.scorePercentage || "0",
        };

        // b. Category Scores
        const catScoreRecords = quizResponse.scores.filter(
          (s) => s.type === "category" && s.categoryId
        );
        const categoryScores: CategoryScore[] = catScoreRecords.map(
          (record) => {
            const cat = categoryMap.get(record.categoryId!)!;
            const tier = record.scoreTierId
              ? tierMap.get(record.scoreTierId)
              : null;
            return {
              categoryId: record.categoryId!,
              categoryTitle: cat?.title || "Unknown Category",
              scoreTierId: record.scoreTierId || "",
              score: record.score || "0",
              score_potential: record.scorePotential || "0",
              score_percentage: record.scorePercentage || "0",
              scoreTierColor: tier?.scoreColour || "",
              scoreTierName: tier?.name || "",
            };
          }
        );

        // c. Highest / Lowest calculation
        // Sort by percentage (parsed as int) or raw score depending on preference. Using percentage as standard.
        const sortedCats = [...categoryScores].sort(
          (a, b) =>
            parseFloat(b.score_percentage) - parseFloat(a.score_percentage)
        );
        const highestCategoryScore =
          sortedCats.length > 0 ? sortedCats[0] : null;
        const lowestCategoryScore =
          sortedCats.length > 0 ? sortedCats[sortedCats.length - 1] : null;

        // d. Question Data
        const questionsData: QuestionData[] = formFieldsResult.map((field) => {
          const answers = quizResponse.quizAnswers.filter(
            (a) => a.projectQuizFieldId === field.id
          );
          return {
            id: field.id,
            title: field.title,
            QuizAnswers: answers.map((a) => ({
              id: a.id,
              answer: a.answer || "",
              option_id: a.optionId || "",
              score: a.score || 0,
              time_spent: a.timeSpent || 0,
            })),
          };
        });

        resultData = {
          overallScore,
          categoryScores,
          questionsData,
          highestCategoryScore,
          lowestCategoryScore,
        };

        // ---------------------------------------------------------
        // E: Redirection Logic (Determine targetPageId) [cite: 1104-1134]
        // ---------------------------------------------------------
        const projectSettings = project.settings
          ? (project.settings as any)
          : {};
        const redirectLogic = projectSettings.quizRedirectLogic as
          | QuizRedirectLogic
          | undefined;

        if (redirectLogic) {
          const { strategy, config } = redirectLogic;

          if (strategy === "DEFAULT") {
            targetPageId = config.default.resultPageId;
          } else if (strategy === "SCORE_TIER") {
            const currentTierId = overallScore.scoreTierId;
            const mapping = config.scoreTier.mappings.find(
              (m) => m.tierId === currentTierId
            );
            targetPageId =
              mapping?.resultPageId || config.scoreTier.fallbackPageId;
          } else if (strategy === "OUTCOME") {
            const direction = config.outcome.scoringDirection; // "HIGHEST" | "LOWEST"
            const relevantCategory =
              direction === "HIGHEST"
                ? highestCategoryScore
                : lowestCategoryScore;

            if (relevantCategory) {
              const mapping = config.outcome.mappings.find(
                (m) => m.categoryId === relevantCategory.categoryId
              );
              targetPageId = mapping?.resultPageId;
            }

            if (!targetPageId) {
              targetPageId = config.outcome.fallbackPageId;
            }
          }
        }
      }

      // ---------------------------------------------------------
      // F: Fetch Funnel Pages (Filtered by redirect logic if Result Page)
      // ---------------------------------------------------------
      const pageColumnsToSelect = {
        id: funnelPages.id,
        title: funnelPages.title,
        type: funnelPages.type,
        status: funnelPages.status,
        defaultPage: funnelPages.defaultPage,
        order: funnelPages.order,
        pathName: funnelPages.pathName,
        metaTitle: funnelPages.metaTitle,
        metaDescription: funnelPages.metaDescription,
        visits: funnelPages.visits,
        previewImage: funnelPages.previewImage,
        theme: funnelPages.theme,
        settings: funnelPages.settings,
        content: funnelPages.content,
      };

      let funnelPagesResult: FinalFunnelPage[] = [];

      // Query Builder
      const pagesQuery = tx
        .select(pageColumnsToSelect)
        .from(funnelPages)
        .innerJoin(funnels, eq(funnelPages.funnelId, funnels.id))
        .where(
          and(eq(funnelPages.type, context), eq(funnels.projectId, projectId))
        )
        .orderBy(asc(funnelPages.order));

      const allPages = await pagesQuery;

      if (context === "Result_Page" && targetPageId) {
        // If we calculated a specific target page, filter the results to only include that page
        funnelPagesResult = allPages.filter((p) => p.id === targetPageId);

        // Fallback: If the calculated ID doesn't exist in the DB (e.g., deleted),
        // fallback to the default page or the first available result page to prevent 404.
        if (funnelPagesResult.length === 0 && allPages.length > 0) {
          funnelPagesResult = [
            allPages.find((p) => p.defaultPage) || allPages[0],
          ];
        }
      } else {
        // For Landing/Quiz pages, or if no redirect logic found, return all (or specific default behavior)
        funnelPagesResult = allPages;
      }

      return {
        projectData: { ...project },
        formFields: formFieldsResult.map((field) => ({
          ...field,
          options: field.quizFieldOptions,
        })) as FormField[],
        categories: categoriesResult as QuestionCategories[],
        funnelPages: funnelPagesResult as FinalFunnelPage[],
        scoreTiersData: scoreTiersData,
        resultData: resultData, // Attach calculated data [cite: 1101, 1104]
      };
    });

    return {
      ...data,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    if (error instanceof QueryError) {
      throw error;
    }
    console.error(" internal error:", error);
    const diagnosticId = Math.random().toString(36).slice(2, 8);
    throw new QueryError(
      500,
      `Internal server error. Diagnostic ID: ${diagnosticId}`
    );
  }
}
