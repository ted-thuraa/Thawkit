// lib/actions/project.actions.ts
"use server";

import { z } from "zod";
import { and, eq, inArray, notInArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import {
  funnelPages,
  funnels,
  projectQuizFields,
  projects,
  quizFieldCategories,
  quizFieldOptions,
  scoreTiers,
} from "@/drizzle/schema";
import { revalidatePath } from "next/cache";

import { projectFormSchema } from "@/lib/validators/project";
import { db } from "@/drizzle/db";
import { createDomainSlug } from "@/lib/utils";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { ResultSetHeader } from "mysql2";
import { getServerSession } from "@/lib/sessionServer";
import { getAuthenticatedOrganizationId } from "@/lib/querries/organization";
import { ProjectData, QuestionField } from "@/stores/pageEditorStore/types";
import {
  FinalFunnelPage,
  FormField,
  FunnelPageModel,
  ProjectModel,
  QuestionCategories,
  ScoreTiers,
} from "@/lib/types/project";
import { updateProjectSettingsSchema } from "@/lib/validators/project";
import {
  DefaultFunnelPageInserts,
  defaultLeadForm,
  DefaultscoreTiers,
} from "@/lib/constants/createProject";
import { previewQueue } from "@/lib/queue";

// Define the shape of the data our action returns
type ActionResponse =
  | {
      success: true;
      data: {
        id: string;
        ref: string;
      };
    }
  | {
      success: false;
      error: string;
    };

// This schema extends the form schema with server-only fields (id, orgId)
const projectActionSchema = projectFormSchema.extend({
  organizationId: z.string(),
  id: z.string().optional(), // An 'id' is optional. If it exists, we update.
});

type ProjetctInsert = typeof projects.$inferInsert;
type FunnelPageInsert = typeof funnelPages.$inferInsert;

const _validateRef = (ref: unknown) => {
  const validation = z.string().min(1).safeParse(ref);
  if (!validation.success) {
    throw new Error("Invalid project reference.");
  }
  return validation.data;
};

/**
 * A Server Action to create or update a project.
 * This function is only ever executed on the server.
 */
export const createOrUpdateProject = async (
  values: z.infer<typeof updateProjectSettingsSchema>
) => {
  const sessionData = await getServerSession();
  if (!sessionData) return;
  const organizationId = sessionData.session.activeOrganizationId;
  if (!organizationId) return;

  const validation = updateProjectSettingsSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }

  const {
    id,
    title,
    description,
    showBrandingLogo,
    draftMode,
    thumbnail,
    questionOrder,
    settings,
  } = validation.data;
  // The 'upsert' logic is implemented using a transaction to handle conditional insert/update
  // and the necessary nested inserts for 'create'.
  try {
    if (id) {
      await db
        .update(projects)
        .set({
          title,
          description: description || null,
          showBrandingLogo: showBrandingLogo,
          draftMode: draftMode,
          thumbnail: thumbnail,
          questionOrder: questionOrder as ProjectModel["questionOrder"],
          ...(settings ? { settings } : {}),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id));

      const [updatedProject] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));

      if (!updatedProject) {
        return { success: false, error: "Project not found." };
      }

      revalidatePath(`/project/${updatedProject.ref}`);
      revalidatePath("/workspace");

      return { success: true, data: updatedProject };
    }

    // CREATE
    // CREATE
    const newProjectId = uuidv4();
    const newFunnelId = uuidv4();
    const newRef = nanoid(8);
    const slug = createDomainSlug(title as string, newRef);

    await db.transaction(async (tx) => {
      // 1. Create Tool
      const projectInsertData: ProjetctInsert = {
        id: newProjectId,
        ref: newRef,
        domain: slug,
        showBrandingLogo: true,
        draftMode: true,
        visits: 0,
        interactions: 0,
        conversionRate: 0, // Using int 0 for 0.0
        leads: 0,
        submissions: 0,
        organizationId: organizationId as string,
        title: values.title as string,
        description: values.description,
        type: "score_quiz",
        settings: {},
        leadOptinForm: defaultLeadForm,
        questionOrder: "asc",
      };

      await tx.insert(projects).values(projectInsertData);

      // 2. Create Score Tiers
      const scoreTierInserts = DefaultscoreTiers.map((tier) => ({
        ...tier,
        projectId: projectInsertData.id,
      }));

      await tx.insert(scoreTiers).values(scoreTierInserts);

      // 3. Create Funnel
      const funnelInsertData = {
        id: newFunnelId,
        projectId: projectInsertData.id,
        name: "",
        published: false,
        subDomainName: slug,
      };
      await tx.insert(funnels).values(funnelInsertData);

      const funnelPageInserts = DefaultFunnelPageInserts.map((p) => ({
        ...p,
        funnelId: funnelInsertData.id,
      }));
      await tx.insert(funnelPages).values(funnelPageInserts);
    });

    const newProject = await db.query.projects.findFirst({
      where: eq(projects.id, newProjectId),
    });

    if (!newProject)
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };

    revalidatePath("/workspace");

    return { success: true, data: { id: newProjectId, ref: newRef } };
  } catch (err) {
    console.error("Failed to save project:", err);

    if (
      err instanceof Error &&
      (err.message.includes("UNIQUE constraint failed") ||
        err.message.includes("Duplicate entry"))
    ) {
      return {
        success: false,
        error:
          "A project with this domain/ref already exists. Please try again.",
      };
    }

    return { success: false, error: "Something went wrong. Please try again." };
  }
};

/**
 * Helper function to generate MySQL ON DUPLICATE KEY UPDATE clause
 * This allows us to bulk upsert without manually mapping every field in the .set() method repeatedly.
 * It tells MySQL: "If ID exists, update the column with the new value passed in the INSERT statement."
 */
const buildConflictUpdateColumns = <T extends Record<string, any>>(
  table: T,
  columns: Array<keyof T>
) => {
  const updateConfig: Record<string, any> = {};
  columns.forEach((col) => {
    // @ts-ignore - Drizzle type complexity
    updateConfig[col] = sql`values(${table[col]})`;
  });
  return updateConfig;
};

export const upsertPageData = async (
  pageValues: FinalFunnelPage,
  projectValues: {
    projectData: ProjectData;
    questions: FormField[];
    categories: QuestionCategories[];
    scoretiers: ScoreTiers[];
  },
  firsSectionId?: string
) => {
  // 1. Authentication & Validation
  const sessionData = await getServerSession();
  if (!sessionData) {
    throw new Error("Unauthorized: No active session found.");
  }

  const { projectData, questions, categories, scoretiers } = projectValues;

  // Validate Project ID existence as a safety guard
  if (!projectData.id) throw new Error("Project ID is missing.");

  // 2. Define Context
  // Context determines which questions to save and whether to save aux data (cats/tiers)
  const context = pageValues.type; // "Landing_page" | "Quiz_Page" | "Result_Page"
  const isResultPage = context === "Result_Page";
  const canUpdateScoreTiers =
    context === "Result_Page" || context === "Quiz_Page";

  try {
    // Start a Transaction.
    await db.transaction(async (tx) => {
      // =================================================
      // 1. Update Project Details (Always run)
      // =================================================
      await tx
        .update(projects)
        .set({
          title: projectData.title as string,
          questionOrder: projectData.questionOrder,
          leadOptinForm: projectData.leadOptinForm,
          settings: projectData.settings,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectData.id as string));

      // =================================================
      // 2. Update Page Details (Always run)
      // =================================================
      await tx
        .update(funnelPages)
        .set({
          title: pageValues.title,
          settings: pageValues.settings,
          content: pageValues.content,
          theme: pageValues.theme,
          metaTitle: pageValues.metaTitle,
          metaDescription: pageValues.metaDescription,
          updatedAt: new Date(),
        })
        .where(eq(funnelPages.id, pageValues.id));

      // =================================================
      // CONDITIONAL BLOCK: Only if NOT Result_Page
      // =================================================
      if (!isResultPage) {
        // --- 3. Bulk Upsert Categories ---
        if (categories.length > 0) {
          const catValues = categories.map((cat) => ({
            id: cat.id,
            projectId: projectData.id as string,
            ref: cat.id,
            order: cat.order,
            icon: cat.icon,
            title: cat.title,
            description: cat.description,
            updatedAt: new Date(),
          }));

          await tx
            .insert(quizFieldCategories)
            .values(catValues)
            .onDuplicateKeyUpdate({
              set: buildConflictUpdateColumns(quizFieldCategories, [
                "order",
                "icon",
                "title",
                "description",
                "updatedAt",
              ]),
            });
        }

        // Prune Deleted Categories
        const currentCatIds = categories.map((c) => c.id);
        if (currentCatIds.length > 0) {
          await tx
            .delete(quizFieldCategories)
            .where(
              and(
                eq(quizFieldCategories.projectId, projectData.id as string),
                notInArray(quizFieldCategories.id, currentCatIds)
              )
            );
        } else {
          await tx
            .delete(quizFieldCategories)
            .where(eq(quizFieldCategories.projectId, projectData.id as string));
        }

        if (canUpdateScoreTiers) {
          // --- 4. Bulk Upsert Score Tiers ---
          if (scoretiers.length > 0) {
            const tierValues = scoretiers.map((tier) => ({
              id: tier.id,
              projectId: projectData.id as string,
              name: tier.name,
              scoreColour: tier.scoreColour,
              scoreFrom: tier.scoreFrom,
              scoreTo: tier.scoreTo,
              updatedAt: new Date(),
            }));

            await tx
              .insert(scoreTiers)
              .values(tierValues)
              .onDuplicateKeyUpdate({
                set: buildConflictUpdateColumns(scoreTiers, [
                  "name",
                  "scoreColour",
                  "scoreFrom",
                  "scoreTo",
                  "updatedAt",
                ]),
              });
          }

          // Prune Deleted Tiers
          const currentTierIds = scoretiers.map((t) => t.id);
          if (currentTierIds.length > 0) {
            await tx
              .delete(scoreTiers)
              .where(
                and(
                  eq(scoreTiers.projectId, projectData.id as string),
                  notInArray(scoreTiers.id, currentTierIds)
                )
              );
          } else {
            await tx
              .delete(scoreTiers)
              .where(eq(scoreTiers.projectId, projectData.id as string));
          }
        }

        // =================================================
        // 5. Bulk Upsert Questions (Filtered by Context)
        // =================================================

        // Filter questions so we only process the ones belonging to the current Page Type
        const filteredQuestions = questions.filter(
          (q) => q.context === context
        );

        if (filteredQuestions.length > 0) {
          const questionInserts = filteredQuestions.map((q) => ({
            id: q.id,
            projectId: projectData.id as string,
            order: q.order,
            title: q.title,
            description: q.description,
            type: q.type,
            formFieldType: q.formFieldType,
            context: q.context,
            displayPage: q.displayPage,
            validations:
              typeof q.validations === "string"
                ? q.validations
                : JSON.stringify(q.validations),
            logicBranch:
              typeof q.logicBranch === "string"
                ? q.logicBranch
                : JSON.stringify(q.logicBranch),
            scoring:
              typeof q.scoring === "string"
                ? q.scoring
                : JSON.stringify(q.scoring),
            settings:
              typeof q.settings === "string"
                ? q.settings
                : JSON.stringify(q.settings),
            categoryIds:
              typeof q.categoryIds === "string"
                ? q.categoryIds
                : JSON.stringify(q.categoryIds),
            updatedAt: new Date(),
          }));

          await tx
            .insert(projectQuizFields)
            .values(questionInserts)
            .onDuplicateKeyUpdate({
              set: buildConflictUpdateColumns(projectQuizFields, [
                "order",
                "title",
                "description",
                "type",
                "formFieldType",
                "context",
                "displayPage",
                "validations",
                "layout",
                "properties",
                "logicBranch",
                "scoring",
                "settings",
                "categoryIds",
                "maxPotentialScore",
                "updatedAt",
              ]),
            });
        }

        // Prune Deleted Questions
        // IMPORTANT: We must also scope the deletion by `context`.
        // If we don't, saving "Quiz_Page" (which doesn't have "Landing_page" questions in the array)
        // would wipe out the Landing Page questions from the DB.
        const currentQuestionIds = filteredQuestions.map((q) => q.id);

        if (currentQuestionIds.length > 0) {
          await tx.delete(projectQuizFields).where(
            and(
              eq(projectQuizFields.projectId, projectData.id as string),
              eq(projectQuizFields.context, context), // Only delete questions of THIS context
              notInArray(projectQuizFields.id, currentQuestionIds)
            )
          );
        } else {
          // If empty array, user deleted all questions FOR THIS CONTEXT
          await tx
            .delete(projectQuizFields)
            .where(
              and(
                eq(projectQuizFields.projectId, projectData.id as string),
                eq(projectQuizFields.context, context)
              )
            );
        }

        // =================================================
        // 6. Bulk Upsert Question Options
        // =================================================
        // Use filteredQuestions to generate options, ensuring we don't process options for excluded questions
        const allOptions = filteredQuestions.flatMap((q) =>
          (q.options || []).map((opt) => ({
            ...opt,
            projectQuizFieldId: q.id,
          }))
        );

        if (allOptions.length > 0) {
          const optionInserts = allOptions.map((opt) => ({
            id: opt.id,
            projectQuizFieldId: opt.projectQuizFieldId,
            order: opt.order,
            label: opt.label,
            mediaType: opt.mediaType || "image",
            mediaSrc: opt.mediaSrc,
            showIcon: opt.showIcon,
            updatedAt: new Date(),
          }));

          await tx
            .insert(quizFieldOptions)
            .values(optionInserts)
            .onDuplicateKeyUpdate({
              set: buildConflictUpdateColumns(quizFieldOptions, [
                "order",
                "label",
                "mediaType",
                "mediaSrc",
                "showIcon",
                "updatedAt",
                "projectQuizFieldId",
              ]),
            });
        }

        // Prune Deleted Options
        const currentOptionIds = allOptions.map((o) => o.id);

        if (currentQuestionIds.length > 0) {
          if (currentOptionIds.length > 0) {
            await tx.delete(quizFieldOptions).where(
              and(
                // Ensure we only look at options belonging to the questions currently being processed
                inArray(
                  quizFieldOptions.projectQuizFieldId,
                  currentQuestionIds
                ),
                notInArray(quizFieldOptions.id, currentOptionIds)
              )
            );
          } else {
            // Questions exist for this context, but all options were deleted
            await tx
              .delete(quizFieldOptions)
              .where(
                inArray(quizFieldOptions.projectQuizFieldId, currentQuestionIds)
              );
          }
        }
      } // End if (!isResultPage)
    });

    // generate preview image
    let pageUrl: string;
    if (context === "Landing_Page") {
      pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/prev/${projectData.ref}/landing/${pageValues.id}`;
    } else if (context === "Quiz_Page") {
      pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/prev/${projectData.ref}/quiz/`;
    } else {
      pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/prev/${projectData.ref}/result/${pageValues.id}`;
    }

    // await previewQueue.add(
    //   "generate",
    //   {
    //     pageId: pageValues.id,
    //     projectId: projectValues.projectData.id,
    //     pageUrl: pageUrl,
    //     pageContext: context,
    //     //heroSelector: firsSectionId ?? "#hero-section", // Configurable selector [cite: 493]
    //     requestId: crypto.randomUUID(),
    //     oldPreviewUrl: pageValues.previewImage, // Pass old URL for cleanup
    //   },
    //   { jobId: pageValues.id }
    // );

    // Revalidate cache
    revalidatePath(`/project/${projectData.ref}`);

    return { success: true, pageUrl: pageUrl };
  } catch (error) {
    console.error("Failed to upsert page data:", error);
    return null;
  }
};

export const updateProjectStatus = async (projectId: string, val: boolean) => {
  // 1. Authentication & Validation
  const sessionData = await getServerSession();
  if (!sessionData) {
    throw new Error("Unauthorized: No active session found.");
  }

  // Validate Project ID existence as a safety guard
  if (!projectId) throw new Error("Project ID is missing.");

  try {
    // Start a Transaction. If any step fails, the DB rolls back to previous state.
    await db.transaction(async (tx) => {
      // =================================================
      // 1. Update Project Details (Single Row)
      // =================================================
      await tx
        .update(projects)
        .set({
          draftMode: val,
          updatedAt: new Date(),
          // Add other mapped fields from ProjectData as needed
        })
        .where(eq(projects.id, projectId));
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to upsert page data:", error);
    // Return null or throw depending on how your client expects errors.
    // The client snippet expects a return to check (!savedPageData).
    return null;
  }
};

// Define the response type for the delete operation
export type DeleteProjectResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

/**
 * A Server Action to securely delete a single project by its 'ref'.
 * Enforces organization-level access control.
 */
export async function deleteProject(
  id: string
): Promise<DeleteProjectResponse> {
  try {
    // 1. Get user's organization (SECURITY)
    const organizationId = await getAuthenticatedOrganizationId();

    // 2. Validate input
    const validatedId = _validateRef(id);

    // 3. Perform the delete operation
    // Drizzle (mysql2 driver) returns a tuple-like result; the first element is the ResultSetHeader
    const rawResult = await db
      .delete(projects)
      .where(
        and(
          eq(projects.id, validatedId),
          eq(projects.organizationId, organizationId)
        )
      );

    // Type assertion: first item is ResultSetHeader (mysql2)
    const header = (rawResult as unknown as [ResultSetHeader, any])?.[0];

    const affectedRows = header?.affectedRows ?? 0;

    if (affectedRows === 0) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    // 4. Revalidate project list
    revalidatePath("/workspace");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete project:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to delete the project.",
    };
  }
}

export type DeletePageResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

/**
 * A Server Action to securely delete a single project by its 'ref'.
 * Enforces organization-level access control.
 */
export async function deletePage(id: string): Promise<DeletePageResponse> {
  try {
    // 1. Get user's organization (SECURITY)
    const organizationId = await getAuthenticatedOrganizationId();

    // 2. Validate input
    const validatedId = _validateRef(id);

    // 3. Perform the delete operation
    // Drizzle (mysql2 driver) returns a tuple-like result; the first element is the ResultSetHeader
    const rawResult = await db
      .delete(funnelPages)
      .where(and(eq(funnelPages.id, validatedId)));

    // Type assertion: first item is ResultSetHeader (mysql2)
    const header = (rawResult as unknown as [ResultSetHeader, any])?.[0];

    const affectedRows = header?.affectedRows ?? 0;

    if (affectedRows === 0) {
      return { success: false, error: "Page not found or unauthorized." };
    }

    // 4. Revalidate project list
    //revalidatePath("/workspace");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete project:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to delete the project.",
    };
  }
}
