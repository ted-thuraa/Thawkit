// db/actions/publishFunnel.ts

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Publishes the current DRAFT state of a funnel: compiles it via
 * compileFunnelPayload(), writes a new immutable `funnel_versions` row,
 * marks it current (unmarking whatever was previously current), and flips
 * `funnels.status`/`publishedAt`. This is the ONLY code path that should
 * ever write `isCurrent = true` — see the versioning note at the top of
 * funnel-content-schema.ts.
 *
 * This is what `submissions.funnelVersionId` (runtime-schema.ts) resolves
 * against — a respondent starting a funnel run always gets whatever
 * version this function most recently marked current, never the live
 * draft, so an operator editing scoring weights mid-campaign can never
 * retroactively change an in-progress or already-completed submission's
 * score (architecture roadmap Module 5's core requirement).
 * ─────────────────────────────────────────────────────────────────────────
 */

import { randomUUID } from "node:crypto";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { funnels } from "@/drizzle/schemas/campaigns-schema";
import { funnelVersions } from "@/drizzle/schemas/funnel-content-schema";
import { compileFunnelPayload } from "../compiler/funnel-compiler";

export type PublishFunnelResult = {
  versionId: string;
  versionNumber: number;
};

/**
 * Throws when the funnel doesn't exist or doesn't belong to
 * `organizationId` — this is an operator action, always tenant-scoped, so
 * unlike the public submission path there's no ambiguity to preserve here;
 * a clear error is the right failure mode for a builder-triggered publish
 * click.
 */
export async function publishFunnel(
  organizationId: string,
  funnelId: string,
): Promise<PublishFunnelResult> {
  const compiled = await compileFunnelPayload(organizationId, funnelId);
  if (!compiled) {
    throw new Error(
      `Funnel ${funnelId} not found for workspace ${organizationId}`,
    );
  }

  return db.transaction(async (tx) => {
    const lastVersion = await tx.query.funnelVersions.findFirst({
      where: eq(funnelVersions.funnelId, funnelId),
      orderBy: desc(funnelVersions.versionNumber),
    });
    const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

    // Unmark whatever was previously current. MySQL has no native
    // partial/filtered unique index (unlike the Postgres target for
    // production, which could enforce "at most one isCurrent row per
    // funnel" at the DB level via a partial unique index) — so this
    // invariant is enforced procedurally here, inside the same
    // transaction as the insert below, rather than by a constraint.
    await tx
      .update(funnelVersions)
      .set({ isCurrent: false })
      .where(
        and(
          eq(funnelVersions.funnelId, funnelId),
          eq(funnelVersions.isCurrent, true),
        ),
      );

    const versionId = randomUUID();
    await tx.insert(funnelVersions).values({
      id: versionId,
      funnelId,
      versionNumber: nextVersionNumber,
      compiledSchema: compiled,
      isCurrent: true,
    });

    await tx
      .update(funnels)
      .set({ status: "published", publishedAt: new Date() })
      .where(eq(funnels.id, funnelId));

    return { versionId, versionNumber: nextVersionNumber };
  });
}
