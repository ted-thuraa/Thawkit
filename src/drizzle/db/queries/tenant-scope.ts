// db/queries/tenant-scope.ts
"use server";
import { db } from "@/drizzle/db";
import { campaigns, funnels } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

/**
 * ─── Tenant Scoping Helpers ──────────────────────────────────────────────────
 *
 * Module 1 / Module 14 of the architecture roadmap require tenant isolation
 * to be enforced "at the data access layer, not the application layer."
 * These functions are the intended single choke point for reading any
 * tenant-owned table — the goal is that forgetting the organizationId filter
 * becomes a compile error (wrong argument count / missing import) rather
 * than a silent cross-tenant data leak in a hand-written `db.select()`.
 *
 * `organizationId` here is Better-Auth's `organization.id` — organization
 * IS ThawKit's Workspace entity (see relations.ts).
 *
 * As Phase 3 introduces the rest of the funnel domain (pages, sections,
 * submissions, contacts, audiences — every one of which will carry its own
 * direct organizationId per the Phase 2 denormalization pattern), extend
 * this file with one scoped accessor per table rather than reaching for
 * `db.select()` / `db.query.*` directly from a route handler or server
 * action.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export class TenantScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantScopeError";
  }
}

/**
 * Fails loudly on a missing/empty tenant id rather than letting an
 * undefined value silently build a WHERE clause that could be satisfied
 * unexpectedly. Every function below routes through this first.
 */
function assertOrganizationId(
  organizationId: string | undefined | null,
): string {
  if (!organizationId || organizationId.trim() === "") {
    throw new TenantScopeError(
      "Tenant-scoped query attempted with a missing organizationId.",
    );
  }
  return organizationId;
}

// ── Campaigns ────────────────────────────────────────────────────────────────

export async function getCampaignsForOrg(organizationId: string) {
  const orgId = assertOrganizationId(organizationId);
  return db.query.campaigns.findMany({
    where: eq(campaigns.organizationId, orgId),
  });
}

export async function getCampaignForOrg(
  organizationId: string,
  campaignId: string,
) {
  const orgId = assertOrganizationId(organizationId);
  // Both conditions are required — campaignId alone is guessable/enumerable.
  // The organizationId condition is what actually prevents cross-tenant
  // access via a leaked or brute-forced campaign id.
  return db.query.campaigns.findFirst({
    where: and(
      eq(campaigns.id, campaignId),
      eq(campaigns.organizationId, orgId),
    ),
  });
}

// ── Funnels ──────────────────────────────────────────────────────────────────

export async function getFunnelsForOrg(organizationId: string) {
  const orgId = assertOrganizationId(organizationId);
  return db.query.funnels.findMany({
    where: eq(funnels.organizationId, orgId),
  });
}

export async function getFunnelForOrg(
  organizationId: string,
  funnelId: string,
) {
  const orgId = assertOrganizationId(organizationId);
  return db.query.funnels.findFirst({
    where: and(eq(funnels.id, funnelId), eq(funnels.organizationId, orgId)),
  });
}
