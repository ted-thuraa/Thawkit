"use server";

import { db } from "@/drizzle/db";
import { scoreTiers } from "@/drizzle/schema";
import { getServerSession } from "@/lib/sessionServer";
import { ScoreTiers } from "@/lib/types/project";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * A Server Action to create or update a project.
 * This function is only ever executed on the server.
 */
export const createOrUpdateScoreTiers = async (
  tiers: ScoreTiers[],
  projectId: string
) => {
  // 1. Authentication Check
  const sessionData = await getServerSession();
  if (!sessionData) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Early exit if no data to process
  if (!tiers || tiers.length === 0) {
    return { success: true, data: [] };
  }

  try {
    // 3. Use a Transaction for Atomicity
    // If any part of this fails, the whole operation rolls back.
    await db.transaction(async (tx) => {
      // Prepare the data for bulk insertion.
      // We ensure the projectId is strictly set from the argument, not the payload.
      // If an ID exists, we use it; otherwise, we generate a new one.
      const valuesToInsert = tiers.map((tier) => ({
        id: tier.id || nanoid(),
        projectId: projectId,
        name: tier.name,
        scoreColour: tier.scoreColour,
        scoreFrom: tier.scoreFrom,
        scoreTo: tier.scoreTo,
        // Explicitly handling dates usually isn't needed if defaultNow() is set,
        // but good for explicit control in bulk ops
        updatedAt: new Date(),
      }));

      // 4. Perform the "Upsert" (Insert ... On Duplicate Key Update)
      // This is O(1) network-wise as it sends a single query for all rows.
      await tx
        .insert(scoreTiers)
        .values(valuesToInsert)
        .onDuplicateKeyUpdate({
          set: {
            name: sql`VALUES(name)`,
            scoreColour: sql`VALUES(score_colour)`,
            scoreFrom: sql`VALUES(score_from)`,
            scoreTo: sql`VALUES(score_to)`,
            updatedAt: new Date(), // Always bump the updated time
          },
        });
    });

    return { success: true, message: "Score tiers saved successfully" };
  } catch (err) {
    console.error("Failed to save score tiers:", err);

    if (err instanceof Error) {
      // Handle specific DB constraints if necessary
      if (
        err.message.includes("UNIQUE constraint failed") ||
        err.message.includes("Duplicate entry")
      ) {
        return {
          success: false,
          error: "Conflict detected in score tier configuration.",
        };
      }
    }

    return {
      success: false,
      error: "Failed to save settings. Please try again.",
    };
  }
};

export const deleteScoreTier = async (tierId: string) => {
  const sessionData = await getServerSession();
  if (!sessionData) return { success: false, error: "Unauthorized" };

  if (!tierId) return { success: false, error: "Tier ID is required" };

  try {
    // Execute the deletion
    const result = await db.delete(scoreTiers).where(eq(scoreTiers.id, tierId));

    // Drizzle's MySql/Pg result usually contains rowsAffected (driver dependent)
    // For standard MySQL driver:
    const rowsAffected = result[0].affectedRows ?? 0;
    // Type assertion: first item is ResultSetHeader (mysql2)

    if (rowsAffected === 0) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    return { success: true, message: "Tier deleted successfully" };
  } catch (err) {
    console.error("Failed to delete score tier:", err);
    return {
      success: false,
      error: "Failed to delete tier. Please try again.",
    };
  }
};
