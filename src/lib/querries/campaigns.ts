// path: src/lib/queries/campaigns.ts

import "server-only";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { campaigns } from "@/drizzle/schemas/campaigns-schema";
import { requireOrgPermission } from "@/lib/auth/require-org-permission";
import { WORKSPACE_ROLE_MATRIX } from "@/lib/workspace/permissions";
import { ValidationError } from "@/lib/errors";
import type {
  CampaignDTO,
  CampaignListFilter,
  PaginatedResult,
} from "@/types/workspace";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

interface CampaignCursor {
  createdAt: string;
  id: string;
}

function encodeCursor(cursor: CampaignCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

function decodeCursor(raw: string): CampaignCursor {
  try {
    const parsed = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    ) as Partial<CampaignCursor>;
    if (typeof parsed.createdAt !== "string" || typeof parsed.id !== "string") {
      throw new Error("Cursor payload shape mismatch.");
    }
    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch (error) {
    throw new ValidationError(
      "The pagination cursor is invalid or has expired.",
      undefined,
      {
        cause: error instanceof Error ? error.message : String(error),
      },
    );
  }
}

/**
 * Org-scoped, keyset-paginated campaign list for the /workspace dashboard.
 * Deliberately read-only in this deliverable — campaign creation/mutation
 * is a separate workstream not covered by the current feature scope.
 *
 * Uses keyset (cursor) pagination on (createdAt, id) instead of OFFSET —
 * see `campaigns_org_status_created_idx` in campaigns-schema.ts, which
 * covers this exact predicate + sort so MySQL never needs a filesort.
 */
export async function listCampaigns(
  organizationId: string,
  filter: CampaignListFilter,
): Promise<PaginatedResult<CampaignDTO>> {
  // Viewing the dashboard is available to any member — this call still
  // verifies live membership, it just allows every role through.
  await requireOrgPermission(
    organizationId,
    WORKSPACE_ROLE_MATRIX.viewWorkspace,
  );

  const pageSize = Math.min(
    Math.max(filter.pageSize ?? DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE,
  );
  const cursor = filter.cursor ? decodeCursor(filter.cursor) : null;

  const rows = await db.query.campaigns.findMany({
    where: and(
      eq(campaigns.organizationId, organizationId),
      filter.status !== "all" ? eq(campaigns.status, filter.status) : undefined,
      cursor
        ? or(
            lt(campaigns.createdAt, new Date(cursor.createdAt)),
            and(
              eq(campaigns.createdAt, new Date(cursor.createdAt)),
              lt(campaigns.id, cursor.id),
            ),
          )
        : undefined,
    ),
    orderBy: [desc(campaigns.createdAt), desc(campaigns.id)],
    // Fetch one extra row to detect whether a next page exists without a
    // separate COUNT query.
    limit: pageSize + 1,
    with: {
      creator: { columns: { id: true, name: true } },
    },
  });

  const hasMore = rows.length > pageSize;
  const page = hasMore ? rows.slice(0, pageSize) : rows;
  const last = page[page.length - 1];

  return {
    items: page.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      createdBy: row.creator
        ? { id: row.creator.id, name: row.creator.name }
        : null,
    })),
    nextCursor:
      hasMore && last
        ? encodeCursor({ createdAt: last.createdAt.toISOString(), id: last.id })
        : null,
    hasMore,
  };
}
