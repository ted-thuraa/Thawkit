// path: src/lib/workspace/resolve-workspace-context.ts

import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { member, organization } from "@/drizzle/schemas/auth-schema";
import { getServerSession } from "@/lib/sessionServer";
//import { setActiveOrganization } from "@/actions/organization";
import { logger } from "@/lib/logger";
import type { OrgRole, WorkspaceResolution } from "@/types/workspace";
import { setActiveOrganization } from "@/actions/organization.actions";

/**
 * Implements the Bootstrapping & Security Sequence from the architecture
 * design doc. Intended to be called once, at the top of
 * `app/(workspace)/workspace/layout.tsx` (not implemented in this backend
 * deliverable — see `src/types/ui-contracts.ts`).
 *
 * Returns a discriminated union rather than calling `redirect()` itself:
 * this keeps the bootstrapping logic pure, unit-testable, and free of a
 * Next.js navigation dependency. The UI layer is responsible for calling
 * `redirect(resolution.to)` when `kind === "redirect"`.
 */
export async function resolveWorkspaceContext(): Promise<WorkspaceResolution> {
  const session = await getServerSession();

  if (!session?.user) {
    return { kind: "redirect", to: "/login", reason: "unauthenticated" };
  }

  if (session.user.banned) {
    logger.info("Blocked banned user from entering workspace", {
      userId: session.user.id,
    });
    return { kind: "redirect", to: "/banned", reason: "banned" };
  }

  let activeOrganizationId = session.session.activeOrganizationId ?? null;

  if (activeOrganizationId === null) {
    const fallbackMembership = await db.query.member.findFirst({
      where: eq(member.userId, session.user.id),
      orderBy: desc(member.createdAt),
    });

    if (!fallbackMembership) {
      return {
        kind: "redirect",
        to: "/onboarding/create-workspace",
        reason: "no-organization",
      };
    }

    activeOrganizationId = fallbackMembership.organizationId;

    // Best-effort repair of a stale/unset session pointer. This request
    // already has a valid org via the fallback lookup above, so a failure
    // here must not block navigation — only log it.
    try {
      await setActiveOrganization(activeOrganizationId);
    } catch (error) {
      logger.warn(
        "Failed to persist fallback active organization onto session",
        {
          userId: session.user.id,
          organizationId: activeOrganizationId,
          error,
        },
      );
    }
  }

  const org = await db.query.organization.findFirst({
    where: eq(organization.id, activeOrganizationId),
  });

  if (!org) {
    logger.warn("Session referenced a non-existent organization", {
      userId: session.user.id,
      organizationId: activeOrganizationId,
    });
    return {
      kind: "redirect",
      to: "/onboarding/create-workspace",
      reason: "organization-not-found",
    };
  }

  if (org.status !== "active") {
    return {
      kind: "redirect",
      to: `/workspace/suspended?reason=${org.status}`,
      reason: "organization-suspended",
    };
  }

  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, org.id),
      eq(member.userId, session.user.id),
    ),
  });

  if (!membership) {
    // Guards the cookieCache staleness window (auth.ts sets a 60s cache): a
    // user removed from the org mid-session can otherwise retain access
    // for up to a minute on a stale cookie.
    logger.info("Stale session referenced a revoked membership", {
      userId: session.user.id,
      organizationId: org.id,
    });
    return {
      kind: "redirect",
      to: "/onboarding/create-workspace",
      reason: "membership-revoked",
    };
  }

  return {
    kind: "ready",
    context: {
      organizationId: org.id,
      organizationName: org.name,
      organizationStatus: org.status,
      role: membership.role as OrgRole,
      userId: session.user.id,
      isImpersonating: Boolean(session.session.impersonatedBy),
    },
  };
}
