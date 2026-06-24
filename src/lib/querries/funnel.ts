// lib/actions/project.actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";

import { projectFormSchema } from "@/lib/validators/project";
import { db } from "@/drizzle/db";
import { funnelPages, funnels, projects } from "@/drizzle/schema";
import { getServerSession } from "../sessionServer";
import { getAuthenticatedOrganizationId } from "./organization";

// --- (Your existing slugify helpers and createOrUpdateProject action) ---
// ... slugify(text) ...
// ... createDomainSlug(title, uniqueId) ...
// ... type ActionResponse = ...
// ... projectActionSchema = ...
// ... async function createOrUpdateProject(input) { ... } ...

// We'll keep this helper here for internal type safety
const _validateRef = (ref: unknown) => {
  const validation = z.string().min(1).safeParse(ref);
  if (!validation.success) {
    throw new Error("Invalid project reference.");
  }
  return validation.data;
};

/**
 * Queries the project, its associated funnel, and then finds the ID of the
 * "Landing_Page" funnel page for that funnel.
 *
 * @param projectRef - The unique reference ID of the project (projects.ref).
 * @returns A promise that resolves to the 'id' of the Landing_Page, or null if not found.
 */
export async function getLandingPageIdByProjectRef(
  projectRef: string
): Promise<string | null> {
  // 1. Join projects -> funnels -> funnelPages
  const result = await db
    .select({
      pageId: funnelPages.id, // Select only the required page ID
    })
    .from(projects)
    // 2. Join to funnels table using project id as the foreign key
    .innerJoin(funnels, eq(funnels.projectId, projects.id))
    // 3. Join to funnelPages table using funnel id
    .innerJoin(funnelPages, eq(funnelPages.funnelId, funnels.id))
    .where(
      and(
        // Filter by the input project reference ID
        eq(projects.ref, projectRef),
        // Filter the funnel page by type "Landing_Page"
        eq(funnelPages.type, "Landing_Page")
      )
    )
    .limit(1); // We only expect one result for a unique project ref and page type

  // Return the pageId from the first (and only) result, or null if not found
  return result.length > 0 ? result[0].pageId : null;
}
