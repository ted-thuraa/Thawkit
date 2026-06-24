"use server";

import { z } from "zod";
import { eq, and, InferSelectModel } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { projects } from "@/drizzle/schema";
import { getAuthenticatedOrganizationId } from "./organization";

class QueryError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "QueryError";
    this.status = status;
  }
}

const _validateRef = (ref: unknown) => {
  const validation = z.string().min(1).safeParse(ref);
  if (!validation.success) {
    throw new QueryError(400, "Invalid project reference.");
  }
  return validation.data;
};

// -----------------------------
// TYPES
// -----------------------------

export interface TScoreTier {
  id: string;
  name: string;
  scoreColour: string;
  scoreFrom: number;
  scoreTo: number;
  // Include all other columns from `scoreTiers` if `true` was used.
}

/**
 * Type for `quizFieldCategories` (used both for the top-level array and the `scores.category` relation).
 */
export interface TQuizFieldCategory {
  id: string;
  order: number;
  icon: string | null;
  title: string | null;
  description: string | null;
  // Include all other columns from `quizFieldCategories`.
}

/**
 * Type for the `projectQuizField` relation (the question definition).
 */
export interface TProjectQuizField {
  id: string;
  order: number;
  title: string;
  description: string | null;
  formFieldType: "LEAD_FORM_ITEM" | "QUESTION_ITEM" | "INFO_ITEM";
  type:
    | "TEXT"
    | "YES_NO"
    | "MULTIPLE_CHOICE"
    | "RANGE"
    | "CONTACT_FORM"
    | "INFO_SCREEN"
    | "IMAGE_BUTTON";
  context: "Landing_Page" | "Quiz_Page" | "Result_Page";
  displayPage: "Landing_Page" | "Quiz_Page" | "Result_Page";
  attachment: string | null;
  validations: string | null;
  layout: string | null;
  properties: string | null;
  logicBranch: string | null;
  scoring: string | null;
  settings: string | null;
  maxPotentialScore: number;
  categoryIds: string | null; // longtext in schema
  // Include all other columns from `projectQuizFields`.
}

// --- 2. Nested Relations (Building the 'with' structure) ---

/**
 * Type for the `scores` relation with its nested relations.
 */
export interface TScoreWithRelations {
  id: string;
  score: string | null; // varchar in schema
  scorePotential: string | null; // varchar in schema
  scorePercentage: string | null; // varchar in schema
  timeSpent: number | null;
  type: string | null;
  categoryId: string | null;

  // Nested relations
  scoreTier: TScoreTier | null;
  category: TQuizFieldCategory | null; // assuming categoryId points to quizFieldCategories
}

/**
 * Type for the `quizAnswers` relation with its nested relations.
 */
export interface TQuizAnswerWithRelations {
  id: string;
  answer: string | null;
  optionId: string | null;
  score: number | null;
  scorePotential: string | null;
  timeSpent: number | null;
  // Nested relation
  projectQuizField: TProjectQuizField;
}

/**
 * Type for the `quizResponses` relation with its nested relations.
 * Note: Only selected columns are included here, plus the nested `with` clauses.
 */
export interface TQuizResponseWithRelations {
  id: string;
  overallScore: number | null;
  leadData: object | null; // JSON column
  status: "RECEIVED" | "PROCESSING" | "COMPLETED" | "FAILED" | "SPAM";
  ipAddressCountry: string | null;
  duration: number | null;
  startedAt: Date;
  completedAt: Date | null;

  // Nested relations
  quizAnswers: TQuizAnswerWithRelations[];
  scores: TScoreWithRelations[];
}

// --- 3. Final Project Data Structure ---

/**
 * The final data structure contained within a successful response.
 * This represents the single project found by the query.
 */
export interface FullProjectData {
  // Columns selected from `projects`
  id: string;
  ref: string;
  // If you uncommented `domain` or `title` in the query, uncomment them here too.
  // domain?: string;
  // title?: string;

  // Top-level relations
  quizFieldCategories: TQuizFieldCategory[];
  quizResponses: TQuizResponseWithRelations[];
}

export type FullProjectQueryResponse =
  | {
      success: true;
      data: FullProjectData;
    }
  | {
      success: false;
      error: string;
    };

// -----------------------------
// QUERY FUNCTION
// -----------------------------
export async function getProjectLeadsWithDetails(
  ref: string
): Promise<FullProjectQueryResponse> {
  try {
    const organizationId = await getAuthenticatedOrganizationId();
    const validatedRef = _validateRef(ref);

    const projectResponseData = await db.query.projects.findFirst({
      where: and(
        eq(projects.ref, validatedRef),
        eq(projects.organizationId, organizationId)
      ),
      columns: {
        id: true,
        ref: true,
        // domain: true,
        // title: true,
        // add any other project columns you want
      },
      // If you have defined relations in your schema file, you can load them here:
      with: {
        //quizFieldCategories: true,
        quizFieldCategories: true,
        quizResponses: {
          columns: {
            id: true,
            overallScore: true,
            leadData: true,
            status: true,
            ipAddressCountry: true,
            duration: true,
            startedAt: true,
            completedAt: true,
            // any other fields you want to expose
          },
          with: {
            quizAnswers: {
              with: {
                projectQuizField: true, // Include the original question text
              },
            },
            scores: {
              with: {
                scoreTier: true, // The tier achieved (e.g., "High Score")
                category: true, // The category this score belongs to
              },
            },
          },
        },
      },
    });

    if (!projectResponseData) {
      throw new QueryError(404, "Project not found.");
    }

    return {
      success: true,
      data: projectResponseData as FullProjectData,
    };
  } catch (err) {
    console.error("getProjectWithDetails error:", err);
    return {
      success: false,
      error: err instanceof QueryError ? err.message : "Something went wrong.",
    };
  }
}
