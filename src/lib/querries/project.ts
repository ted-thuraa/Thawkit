// lib/actions/project.actions.ts
"use server";

import { z } from "zod";
import { eq, and, InferSelectModel, asc } from "drizzle-orm";

import { db } from "@/drizzle/db";
import {
  funnelPages,
  funnels,
  projectQuizFields,
  projects,
  quizFieldCategories,
  quizFieldOptions,
  scoreTiers,
} from "@/drizzle/schema";
import { getAuthenticatedOrganizationId } from "./organization";
import {
  QuestionCategories,
  FinalFunnelPage,
  FormField,
  ProjectModel,
  MinimalFunnelPage,
  ScoreTiers,
} from "../types/project";
import { redirect } from "next/navigation";

/**
 * Error class used to carry HTTP-like status codes and messages.
 * Use this for controlled failures that the caller may act on.
 */
class QueryError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "QueryError";
    this.status = status;
  }
}

// --- Helpers ---

const _validateRef = (ref: unknown) => {
  const validation = z.string().min(1).safeParse(ref);
  if (!validation.success) {
    throw new QueryError(400, "Invalid project reference.");
  }
  return validation.data;
};

// --- Types & helper query function (kept for internal type safety) ---

export type DetailedProjectQueryResponse = NonNullable<
  Awaited<ReturnType<typeof _queryProjectWithDetails>>
>;

/**
 * Internal helper that runs the full project-with-relations query.
 * This is kept separate so we can reuse the query in other functions.
 */
const _queryProjectWithDetails = async (
  ref: string,
  organizationId: string
) => {
  return await db.query.projects.findFirst({
    where: and(
      eq(projects.ref, ref),
      eq(projects.organizationId, organizationId)
    ),
    with: {
      projectQuizFields: {
        orderBy: (fields, { asc }) => [asc(fields.order)],
        with: {
          quizFieldOptions: {
            orderBy: (options, { asc }) => [asc(options.order)],
          },
        },
      },
      scoreTiers: {
        orderBy: (tiers, { asc }) => [asc(tiers.scoreFrom)],
      },
      quizFieldCategories: true,
    },
  });
};

// --- ACTION 1: GET BASIC PROJECT DETAILS ---

export type BasicProjectQueryResponse =
  | {
      success: true;
      data: {
        id: string;
        title: string;
        description: string | null;
        thumbnail: string | null;
        domain: string | null;
        ref: string;
      };
    }
  | {
      success: false;
      error: string;
    };

/**
 * Fetches minimal/basic details for a project belonging to the authenticated organization.
 */
export async function getBasicProjectDetails(
  ref: string
): Promise<BasicProjectQueryResponse> {
  try {
    const organizationId = await getAuthenticatedOrganizationId();
    const validatedRef = _validateRef(ref);

    const [project] = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        thumbnail: projects.thumbnail,
        domain: projects.domain,
        ref: projects.ref,
      })
      .from(projects)
      .where(
        and(
          eq(projects.ref, validatedRef),
          eq(projects.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    return { success: true, data: project };
  } catch (err) {
    console.error("getBasicProjectDetails error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}

// --- ACTION 2: GET FULL PROJECT DETAILS ---
export type FullProjectDataResponse = NonNullable<
  Awaited<ReturnType<typeof _queryProjectWithDetails>>
>;

export type FullProjectQueryResponse =
  | {
      success: true;
      data: FullProjectDataResponse;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Fetches full project details (fields, options, score tiers, categories) for the authenticated organization.
 */
export async function getProjectWithDetails(
  ref: string
): Promise<FullProjectQueryResponse> {
  try {
    const organizationId = await getAuthenticatedOrganizationId();
    const validatedRef = _validateRef(ref);

    const project = await _queryProjectWithDetails(
      validatedRef,
      organizationId
    );

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    return { success: true, data: project };
  } catch (err) {
    console.error("getProjectWithDetails error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}

// --- LIST PROJECTS FOR ORGANIZATION ---

export type BasicProjectListItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  previewImage: string | null;
  domain: string | null;
  ref: string;
  draftMode: boolean;
  updatedAt: Date;
};

export type OrganizationProjectsQueryResponse =
  | {
      success: true;
      data: BasicProjectListItem[];
    }
  | {
      success: false;
      error: string;
    };

/**
 * Returns a list of projects belonging to the user's authenticated organization.
 */
export async function getOrganizationProjects(): Promise<OrganizationProjectsQueryResponse> {
  try {
    const organizationId = await getAuthenticatedOrganizationId();

    const projectsList = await db.query.projects.findMany({
      columns: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        previewImage: true,
        domain: true,
        ref: true,
        draftMode: true,
        updatedAt: true,
      },
      where: eq(projects.organizationId, organizationId),
      orderBy: (p, { desc }) => [desc(p.updatedAt)],
    });

    return { success: true, data: projectsList };
  } catch (err) {
    console.error("getOrganizationProjects error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load projects.",
    };
  }
}

// --- Editor fetch types & fetch function ---

export type Context = "Landing_Page" | "Quiz_Page" | "Result_Page";

export interface FetchRequest {
  projectRefId: string;
  context: Context;
  funnelPageId?: string;
}

export interface FetchEditorDataResponse {
  projectData: {
    id: ProjectModel["id"];
    ref: ProjectModel["ref"];
    title: ProjectModel["title"];
    domain: ProjectModel["domain"];
    draftMode: ProjectModel["draftMode"];
    questionOrder: ProjectModel["questionOrder"];
    settings: ProjectModel["settings"];
    leadOptinForm: ProjectModel["leadOptinForm"];
  };
  formFields: FormField[];
  categories: QuestionCategories[];
  funnelPages: FinalFunnelPage[];
  scoreTiersData: ScoreTiers[];
  fetchedAt: number;
}

/**
 * Fetches structured editor data for a project (form fields, categories, funnel pages).
 *
 * Throws QueryError on 4xx/5xx conditions so the caller can handle HTTP-like responses.
 */
async function fetchProjectData({
  projectRefId,
  context,
  funnelPageId,
}: {
  projectRefId: string;
  context: string; // e.g., "Result_Page", "Quiz_Page", "Landing_Page"
  funnelPageId?: string;
}) {
  const data = await db.transaction(async (tx) => {
    // A: Resolve project id from ref
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
      .where(eq(projects.ref, projectRefId))
      .limit(1);

    const project = projectRows[0];
    if (!project) {
      // 🛑 CRITICAL FIX: Calling redirect() here will throw an error.
      // We rely on the surrounding try...catch (or the caller's catch)
      // to *not* handle this specific throw, allowing the redirect to occur.
      // If we keep the try...catch around the transaction, it will catch it
      // as a generic error unless specifically handled.
      // Here, we let it propagate, and the outer handler will not catch it
      // as a generic internal error.
      redirect("/not-found");
    }
    const projectId = project.id;
    const projectRef = project.ref;
    type ProjectContext = "Landing_Page" | "Quiz_Page" | "Result_Page";

    // B: Load form fields with their options for the given context
    // Simplify the conditional loading logic using a dynamic 'where' clause
    const formFieldsWhereCondition =
      context === "Result_Page"
        ? eq(projectQuizFields.projectId, projectId)
        : and(
            eq(projectQuizFields.projectId, projectId),
            eq(projectQuizFields.context, context as ProjectContext)
          );

    const formFieldsResult = await tx.query.projectQuizFields.findMany({
      where: formFieldsWhereCondition,
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

    // C: Load categories
    const categoriesResult = await tx
      .select()
      .from(quizFieldCategories)
      .where(eq(quizFieldCategories.projectId, projectId))
      .orderBy(asc(quizFieldCategories.order));

    let scoreTiersData: ScoreTiers[] = [];
    const canGetScoreTiers =
      context === "Result_Page" || context === "Quiz_Page";

    // Load score tiers only if context is not "Landing_Page" (or always load if needed)
    // The commented out logic suggested loading score tiers unless it's the landing page
    if (canGetScoreTiers) {
      scoreTiersData = await tx
        .select()
        .from(scoreTiers)
        .where(eq(scoreTiers.projectId, projectId));
      // .orderBy(asc(scoreTiers.order)); // OrderBy is commented out in original
    }

    // D: Funnel pages
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
      scripts: funnelPages.scripts,
      theme: funnelPages.theme,
      settings: funnelPages.settings,
      content: funnelPages.content,
    };

    let funnelPagesResult: FinalFunnelPage[] = [];
    let funnelPagesWhereCondition;

    if (context === "Quiz_Page") {
      funnelPagesWhereCondition = and(
        eq(funnelPages.type, "Quiz_Page"),
        eq(funnels.projectId, projectId)
      );
    } else if (funnelPageId) {
      funnelPagesWhereCondition = and(
        eq(funnelPages.id, funnelPageId),
        eq(funnels.projectId, projectId)
      );
    }

    if (funnelPagesWhereCondition) {
      let query = tx
        .select(pageColumnsToSelect)
        .from(funnelPages)
        .innerJoin(funnels, eq(funnelPages.funnelId, funnels.id))
        .where(funnelPagesWhereCondition)
        .orderBy(asc(funnelPages.order));

      // 2. Conditionally apply .limit(1) using standard JS
      if (funnelPageId) {
        query = query.limit(1) as any;
      }
      // 3. Await the final query
      funnelPagesResult = await query;
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
    };
  });

  return {
    ...data,
    fetchedAt: Date.now(),
  };
}
export async function fetchProjectEditorData(params: {
  projectRefId: string;
  context: string;
  funnelPageId?: string;
}) {
  try {
    // 1. Call the function containing the transaction
    const data = await fetchProjectData(params);
    return data;
  } catch (error) {
    // 2. ONLY CATCH EXPLICIT QueryError OR Generic Errors
    // The error thrown by a framework's redirect (e.g., Next.js) will propagate out,
    // which is the desired behavior for a successful redirect.

    // You need a way to identify the error thrown by 'redirect'.
    // If you're using Next.js/Remix/etc., their 'redirect' function throws a specific
    // error object/symbol that the framework recognizes.
    // Assuming your 'QueryError' is a custom application error you want to handle.

    if (error instanceof QueryError) {
      // rethrow known query errors so the caller can translate to a response code
      throw error;
    }

    // 🛑 If the error is not a known application error, assume it's an internal server error
    // or the 'redirect' throw.
    // You *must* be sure that the 'redirect' error type is NOT captured by this generic catch,
    // or your redirect will fail and return a 500 error page.

    // A common pattern is:
    // if (isRedirectError(error)) { throw error; } // Let redirect throw propagate

    console.error("internal error:", error);
    const diagnosticId = Math.random().toString(36).slice(2, 8);
    throw new QueryError(
      500,
      `Internal server error. Diagnostic ID: ${diagnosticId}`
    );
  }
}

export interface FetchProjectPagesDataResponse {
  projectData: {
    id: ProjectModel["id"];
  };
  funnelPages: MinimalFunnelPage[];
  fetchedAt: number;
}

/**
 * Fetch all pages for a project using either project ref or project id.
 * Returns id, ref, type, draftMode, title.
 */
export async function getProjectPages(
  projectId: string
): Promise<FetchProjectPagesDataResponse> {
  // Validation
  if (!projectId) {
    throw new QueryError(400, "projectId is required.");
  }

  try {
    const data = await db.transaction(async (tx) => {
      // A: Resolve project id from ref
      const projectRows = await tx
        .select({
          id: projects.id,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      const project = projectRows[0];
      if (!project) {
        throw new QueryError(404, `Project with ref ${projectId} not found.`);
      }

      // D: Funnel pages
      const pageColumnsToSelect = {
        id: funnelPages.id,
        title: funnelPages.title,
        type: funnelPages.type,
        status: funnelPages.status,
        defaultPage: funnelPages.defaultPage,
        order: funnelPages.order,
        pathName: funnelPages.pathName,
        previewImage: funnelPages.previewImage,
      };

      let funnelPagesResult: MinimalFunnelPage[] = [];

      funnelPagesResult = await tx
        .select(pageColumnsToSelect)
        .from(funnelPages)
        .innerJoin(funnels, eq(funnelPages.funnelId, funnels.id))
        .where(and(eq(funnels.projectId, projectId)))
        .orderBy(asc(funnelPages.order));

      return {
        projectData: { ...project },
        funnelPages: funnelPagesResult as MinimalFunnelPage[],
      };
    });

    return {
      ...data,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    if (error instanceof QueryError) {
      // rethrow known query errors so the caller can translate to a response code
      throw error;
    }
    console.error("fetchProjectEditorData - internal error:", error);
    const diagnosticId = Math.random().toString(36).slice(2, 8);
    throw new QueryError(
      500,
      `Internal server error. Diagnostic ID: ${diagnosticId}`
    );
  }
}
