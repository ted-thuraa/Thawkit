// lib/actions/project.actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";

import { projectFormSchema } from "@/lib/validators/project";
import { db } from "@/drizzle/db";
import { projects } from "@/drizzle/schema";
import { getServerSession } from "../sessionServer";

/**
 * Gets the active organization ID for the authenticated user.
 * Throws an error if the user is not authenticated.
 */
export const getAuthenticatedOrganizationId = async () => {
  const sessionData = await getServerSession();

  // The error message indicated the session object is nested
  if (!sessionData?.session) {
    throw new Error("Not authenticated");
  }

  // Correct path is sessionData.session.activeOrganizationId
  const orgId = sessionData.session.activeOrganizationId;

  if (!orgId) {
    // This case might mean the user is authenticated but has no active org
    // You might want to handle this differently depending on your app's logic
    throw new Error("No active organization selected.");
  }

  return orgId;
};
