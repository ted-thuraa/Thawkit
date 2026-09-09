// path: src/lib/actions/editor-actions.ts

"use server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { funnel } from "@/drizzle/schemas/campaigns-schema";
import { pages, funnelVersions } from "@/drizzle/schemas/funnel-content-schema";
import { requireCampaignEditPermission } from "@/lib/auth/require-campaign-permission";
import type { PageRow } from "@/lib/editor/resolve-editor-bootstrap";
import type { Layer } from "@/types/editor/layerSchema";
import type { PageType } from "@/types/PageCMS/pageSchema";
//import type { ActionResult } from "@/types/action-result";
import {
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";
import { requirePageInCampaign } from "@/components/editor/require-page-in-campaign";

/**
 * ASSUMED SHAPE — not verified against this project's actual
 * `ActionResult<T>`. The project's established pattern ("All mutations as
 * typed Server Actions returning `ActionResult<T>`") implies this type
 * already exists somewhere in the real codebase; it wasn't in any file
 * shared so far. This is the most common shape for exactly this pattern —
 * a discriminated union so callers must check `success` before touching
 * `data`, with a plain string `error` for the failure case — but swap this
 * file's import in editor-actions.ts for the real one if it differs
 * (e.g. a structured error object instead of a string, or a `fieldErrors`
 * map for form validation).
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Typed Server Action replacements for Ycode's REST mutation routes
 * (app/(builder)/ycode/api/pages/route.ts,
 * app/(builder)/ycode/api/pages/[id]/route.ts,
 * app/(builder)/ycode/api/layers/route.ts — github.com/ycode/ycode, MIT
 * licensed). Every action here follows the same shape: authorize via
 * `requireCampaignEditPermission`/`requirePageInCampaign` first, mutate,
 * return `ActionResult<T>` — never throw across the RPC boundary to the
 * client, per this project's established Server Action contract.
 *
 * SIMPLIFIED vs. Ycode's routes, deliberately:
 *   - No `page_folder_id`/`depth`/`is_index`/`is_dynamic`/`error_page`/
 *     `is_publishable` handling — none of that applies to a funnel's flat,
 *     linearly-ordered page list (PageFolder was rejected; homepage/error
 *     pages/dynamic-page routing are website concepts, not funnel-step
 *     concepts). `createPageAction` takes `pageType` instead, matching
 *     this project's own enum.
 *   - No live/draft publish-state toggling on the page row itself —
 *     publishing works through `funnel_versions.compiledSchema`
 *     (funnel-content-schema.ts), not a per-page `is_published` flag with
 *     unpublish-cascade logic like Ycode's `PUT` handler has.
 *   - Slug uniqueness: on a collision, this returns a friendly
 *     `ActionResult` error rather than Ycode's implicit reliance on the DB
 *     throwing. No auto-suffix retry — surfacing the conflict to the user
 *     to rename is simpler and less surprising than silently picking
 *     "my-page-2" for them.
 * ─────────────────────────────────────────────────────────────────────────
 */

function slugify(title: string): string {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
}

/** Shared error -> ActionResult translation, so each action doesn't repeat this. */
function toErrorResult(
  error: unknown,
  fallbackMessage: string,
): ActionResult<never> {
  const isKnownAppError =
    error instanceof UnauthenticatedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError;

  if (isKnownAppError) {
    // `instanceof Error` (not a direct `.message` read) so this doesn't
    // depend on knowing lib/errors.ts's exact class hierarchy — safe as
    // long as these extend the standard Error, which every thrown-and-
    // caught error in this codebase already implies.
    const message = error instanceof Error ? error.message : fallbackMessage;
    return { success: false, error: message };
  }

  logger.error(fallbackMessage, { error });
  return { success: false, error: fallbackMessage };
}

export async function createPageAction(
  campaignId: string,
  input: { title: string; pageType: PageType },
): Promise<ActionResult<PageRow>> {
  try {
    const { campaign } = await requireCampaignEditPermission(campaignId);

    const funnelRow = await db.query.funnel.findFirst({
      where: eq(funnel.campaignId, campaign.id),
      orderBy: asc(funnel.createdAt),
    });
    if (!funnelRow) {
      throw new Error(`Campaign ${campaignId} has no associated funnel.`);
    }

    const existingPages = await db.query.pages.findMany({
      where: eq(pages.funnelId, funnelRow.id),
    });
    const nextOrder =
      existingPages.length > 0
        ? Math.max(...existingPages.map((p) => p.order)) + 1
        : 0;

    const slug = slugify(input.title);
    const slugTaken = existingPages.some((p) => p.slug === slug);
    if (slugTaken) {
      return {
        success: false,
        error: `A page with a matching slug ("${slug}") already exists in this funnel.`,
      };
    }

    // Seeds exactly the same initial draft Ycode's own POST /api/pages
    // does — a single non-deletable `body` root and nothing else. See
    // layerSchema.ts / layer-tree-utils.ts's `'body'` convention notes.
    const bodyLayer: Layer = {
      id: "body",
      name: "body",
      classes: "",
      children: [],
    };

    const newPage: PageRow = {
      id: nanoid(),
      funnelId: funnelRow.id,
      slug,
      title: input.title,
      order: nextOrder,
      pageType: input.pageType,
      isLinearDefault: true,
      seo: null,
      config: null,
      layers: [bodyLayer],
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
    };

    await db.insert(pages).values(newPage);

    return { success: true, data: newPage };
  } catch (error) {
    return toErrorResult(error, "Failed to create page.");
  }
}

/** Duplicate a page, including its complete layer tree and page metadata. */
export async function duplicatePageAction(
  campaignId: string,
  pageId: string,
): Promise<ActionResult<PageRow>> {
  try {
    const { page } = await requirePageInCampaign(campaignId, pageId);
    const siblings = await db.query.pages.findMany({
      where: eq(pages.funnelId, page.funnelId),
    });
    const baseTitle = `${page.title} Copy`;
    let title = baseTitle;
    let suffix = 2;
    while (siblings.some((candidate) => candidate.title === title)) {
      title = `${baseTitle} ${suffix++}`;
    }
    const baseSlug = slugify(title);
    let slug = baseSlug;
    suffix = 2;
    while (siblings.some((candidate) => candidate.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const duplicate: PageRow = {
      ...page,
      id: nanoid(),
      title,
      slug,
      order: Math.max(...siblings.map((candidate) => candidate.order), -1) + 1,
      layers: structuredClone(page.layers),
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
    };
    await db.insert(pages).values(duplicate);
    return { success: true, data: duplicate };
  } catch (error) {
    return toErrorResult(error, "Failed to duplicate page.");
  }
}

export async function updatePageAction(
  campaignId: string,
  pageId: string,
  updates: Partial<
    Pick<PageRow, "title" | "slug" | "seo" | "config" | "pageType">
  >,
): Promise<ActionResult<PageRow>> {
  try {
    const { page } = await requirePageInCampaign(campaignId, pageId);

    if (updates.slug && updates.slug !== page.slug) {
      const siblings = await db.query.pages.findMany({
        where: eq(pages.funnelId, page.funnelId),
      });
      const slugTaken = siblings.some(
        (p) => p.id !== pageId && p.slug === updates.slug,
      );
      if (slugTaken) {
        return {
          success: false,
          error: `A page with the slug "${updates.slug}" already exists in this funnel.`,
        };
      }
    }

    await db.update(pages).set(updates).where(eq(pages.id, pageId));

    const updated = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
    });
    if (!updated)
      throw new NotFoundError("Page not found after update.", { pageId });

    return { success: true, data: updated };
  } catch (error) {
    return toErrorResult(error, "Failed to update page.");
  }
}

export async function deletePageAction(
  campaignId: string,
  pageId: string,
): Promise<ActionResult<{ deletedId: string }>> {
  try {
    await requirePageInCampaign(campaignId, pageId);

    await db.delete(pages).where(eq(pages.id, pageId));

    return { success: true, data: { deletedId: pageId } };
  } catch (error) {
    return toErrorResult(error, "Failed to delete page.");
  }
}

/**
 * Bulk-persists a new step order after a drag-reorder in the Pages tab.
 * `orderedPageIds` is the full, final ordering (index = new `order`
 * value) — the caller (the Pages tree) is expected to have already
 * reordered its own local copy optimistically before calling this.
 */
export async function reorderPagesAction(
  campaignId: string,
  orderedPageIds: string[],
): Promise<ActionResult<{ updated: number }>> {
  try {
    const { campaign } = await requireCampaignEditPermission(campaignId);

    const funnelRow = await db.query.funnel.findFirst({
      where: eq(funnel.campaignId, campaign.id),
      orderBy: asc(funnel.createdAt),
    });
    if (!funnelRow)
      throw new Error(`Campaign ${campaignId} has no associated funnel.`);

    const existingPages = await db.query.pages.findMany({
      where: eq(pages.funnelId, funnelRow.id),
    });
    const validIds = new Set(existingPages.map((p) => p.id));
    const allBelongToThisFunnel = orderedPageIds.every((id) =>
      validIds.has(id),
    );
    if (
      !allBelongToThisFunnel ||
      orderedPageIds.length !== existingPages.length
    ) {
      return {
        success: false,
        error: "Page list does not match this funnel's current pages.",
      };
    }

    await Promise.all(
      orderedPageIds.map((id, index) =>
        db.update(pages).set({ order: index }).where(eq(pages.id, id)),
      ),
    );

    return { success: true, data: { updated: orderedPageIds.length } };
  } catch (error) {
    return toErrorResult(error, "Failed to reorder pages.");
  }
}

/**
 * Persists the current in-memory layer tree for one page — the direct
 * equivalent of Ycode's `PUT /ycode/api/layers?page_id=X`. Called from the
 * client with whatever `use-pages-store.ts` currently holds for that page
 * (that store's mutations are synchronous/local-only by design — see its
 * file header — this is the one place that data actually reaches the DB).
 */
export async function saveDraftLayersAction(
  campaignId: string,
  pageId: string,
  layers: Layer[],
): Promise<ActionResult<{ savedAt: string }>> {
  try {
    await requirePageInCampaign(campaignId, pageId);

    await db.update(pages).set({ layers }).where(eq(pages.id, pageId));

    return { success: true, data: { savedAt: new Date().toISOString() } };
  } catch (error) {
    return toErrorResult(error, "Failed to save page.");
  }
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * PARTIAL / PLACEHOLDER SNAPSHOT — read this before wiring anything else to
 * `compiledSchema`. `funnel_content_schema.ts`'s file header references a
 * not-yet-built `db/compiler/compileFunnelPayload.ts` that's supposed to
 * assemble the FULL `funnelPayloadSchema` — pages, question categories,
 * scoring, and audiences merged together — into one immutable snapshot.
 * That compiler doesn't exist yet, and building it is a separate,
 * significantly larger effort than "wire the Publish button," entangled
 * with the original (unchanged) funnel-flow/scoring system this
 * integration deliberately left alone.
 *
 * What THIS action actually snapshots is narrower: just each page's
 * layers/title/slug/order/pageType/seo/config — the part the Ycode editor
 * integration actually touches. It's a real, working version history for
 * that data (versionNumber increments correctly, exactly one row per
 * funnel has `isCurrent: true`), but it is NOT yet what a public
 * funnel-rendering route should read from to serve a live funnel — that
 * route needs the full compiled payload, which needs the real compiler.
 * Treat this as "the editor's own undo-safe snapshot mechanism now works
 * end to end," not "publishing is fully implemented."
 *
 * Wrapped in `db.transaction()` — matching this project's own established
 * pattern for atomic multi-row inserts (per-funnel "exactly one current
 * version" is a real invariant two concurrent publishes could otherwise
 * violate).
 * ─────────────────────────────────────────────────────────────────────────
 */
export async function publishFunnelAction(
  campaignId: string,
): Promise<ActionResult<{ versionNumber: number }>> {
  try {
    const { campaign } = await requireCampaignEditPermission(campaignId);

    const funnelRow = await db.query.funnel.findFirst({
      where: eq(funnel.campaignId, campaign.id),
      orderBy: asc(funnel.createdAt),
    });
    if (!funnelRow) {
      throw new Error(`Campaign ${campaignId} has no associated funnel.`);
    }

    const funnelPages = await db.query.pages.findMany({
      where: eq(pages.funnelId, funnelRow.id),
      orderBy: asc(pages.order),
    });

    const previousVersions = await db.query.funnelVersions.findMany({
      where: eq(funnelVersions.funnelId, funnelRow.id),
    });
    const nextVersionNumber =
      previousVersions.length > 0
        ? Math.max(...previousVersions.map((v) => v.versionNumber)) + 1
        : 1;

    const now = new Date();
    const newVersionId = nanoid();

    await db.transaction(async (tx) => {
      await tx
        .update(funnelVersions)
        .set({ isCurrent: false })
        .where(eq(funnelVersions.funnelId, funnelRow.id));

      await tx.insert(funnelVersions).values({
        id: newVersionId,
        funnelId: funnelRow.id,
        versionNumber: nextVersionNumber,
        // See the PARTIAL/PLACEHOLDER note above — this is not the full
        // funnelPayloadSchema shape yet.
        compiledSchema: {
          pages: funnelPages.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            order: p.order,
            pageType: p.pageType,
            seo: p.seo,
            config: p.config,
            layers: p.layers,
          })),
        },
        isCurrent: true,
        publishedAt: now,
      });

      await Promise.all(
        funnelPages.map((p) =>
          tx.update(pages).set({ publishedAt: now }).where(eq(pages.id, p.id)),
        ),
      );
    });

    return { success: true, data: { versionNumber: nextVersionNumber } };
  } catch (error) {
    return toErrorResult(error, "Failed to publish funnel.");
  }
}
