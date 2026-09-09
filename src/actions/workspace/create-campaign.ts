// path: src/actions/workspace/campaigns.ts

"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/drizzle/db";
import { campaign, funnel } from "@/drizzle/schemas/campaigns-schema";
import { requireOrgPermission } from "@/lib/auth/require-org-permission";
import { WORKSPACE_ROLE_MATRIX } from "@/lib/workspace/permissions";
import {
  ForbiddenError,
  NotFoundError,
  UpstreamServiceError,
  isAppError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  createCampaignSchema,
  deleteCampaignSchema,
  updateCampaignSchema,
  type CreateCampaignInput,
  type DeleteCampaignInput,
  type UpdateCampaignInput,
} from "@/lib/validation/campaign";
import type { ActionResult, CampaignDTO } from "@/types/workspace";
import { nanoid } from "nanoid";
import { seedDefaultPagesForFunnel } from "./seedFunnelPage";

const WORKSPACE_DASHBOARD_PATH = "/workspace";

function toActionError<T>(
  error: unknown,
  actionName: string,
  context: Record<string, unknown>,
): ActionResult<T> {
  if (isAppError(error)) {
    logger.warn(`${actionName} rejected`, { ...context, error });
    return { ok: false, error: error.toClientSafe() };
  }
  logger.error(`${actionName} failed unexpectedly`, { ...context, error });
  const wrapped = new UpstreamServiceError(
    "Something went wrong. Please try again.",
    error,
  );
  return { ok: false, error: wrapped.toClientSafe() };
}

/**
 * Step 4–9 of the creation flow: re-validate, authorize, transactionally
 * insert a campaign + its default funnel, invalidate the dashboard, and
 * return a typed result. Never throws across the RPC boundary — the client
 * form (createCampaignForm.tsx) drives navigation off the returned id,
 * `redirect()` is deliberately NOT called here (see design doc rationale:
 * it would be silently swallowed by this function's own try/catch).
 */
export async function createCampaign(
  input: CreateCampaignInput,
): Promise<ActionResult<CampaignDTO>> {
  const parsed = createCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid campaign details.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const { organizationId, name } = parsed.data;

  try {
    const actor = await requireOrgPermission(
      organizationId,
      WORKSPACE_ROLE_MATRIX.createCampaign,
    );

    if (actor.organizationStatus !== "active") {
      throw new ForbiddenError(
        "Campaigns can't be created while this workspace is suspended.",
      );
    }

    const campaignId = nanoid();
    const funnelId = nanoid();
    const now = new Date();

    // Transactional: a campaign without a funnel — or a funnel without its
    // default home/result pages — is a dead end for the destination page
    // (the editor has nothing to load). All three inserts succeed
    // together or none do.
    await db.transaction(async (tx) => {
      await tx.insert(campaign).values({
        id: campaignId,
        organizationId,
        name,
        status: "draft",
        createdBy: actor.userId,
        createdAt: now,
        updatedAt: now,
      });

      await tx.insert(funnel).values({
        id: funnelId,
        organizationId,
        campaignId,
        name: "Main funnel",
        createdAt: now,
        updatedAt: now,
      });

      await seedDefaultPagesForFunnel(tx, { funnelId, now });
    });

    logger.info("Campaign created", {
      organizationId,
      campaignId,
      funnelId,
      actorId: actor.userId,
    });
    revalidatePath(WORKSPACE_DASHBOARD_PATH);

    return {
      ok: true,
      data: {
        id: campaignId,
        name,
        status: "draft",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        createdBy: { id: actor.userId, name: "" },
      },
    };
  } catch (error) {
    return toActionError(error, "createCampaign", { organizationId, name });
  }
}

export async function updateCampaign(
  input: UpdateCampaignInput,
): Promise<ActionResult<CampaignDTO>> {
  const parsed = updateCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid update.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const { organizationId, campaignId, name, status } = parsed.data;

  try {
    const actor = await requireOrgPermission(
      organizationId,
      WORKSPACE_ROLE_MATRIX.manageCampaigns,
    );

    const existing = await db.query.campaign.findFirst({
      where: and(
        eq(campaign.id, campaignId),
        eq(campaign.organizationId, organizationId),
      ),
    });

    if (!existing) {
      throw new NotFoundError("Campaign not found in this workspace.", {
        campaignId,
      });
    }

    // mysql2 returns a [ResultSetHeader, FieldPacket[]] tuple — MySQL has
    // no RETURNING clause, so affectedRows is how a no-op update is detected.
    const [result] = await db
      .update(campaign)
      .set({
        ...(name !== undefined ? { name } : {}),
        ...(status !== undefined ? { status } : {}),
      })
      .where(
        and(
          eq(campaign.id, campaignId),
          eq(campaign.organizationId, organizationId),
        ),
      );

    if (result.affectedRows === 0) {
      throw new NotFoundError("Campaign not found in this workspace.", {
        campaignId,
      });
    }

    logger.info("Campaign updated", {
      organizationId,
      campaignId,
      name,
      status,
      actorId: actor.userId,
    });
    revalidatePath(WORKSPACE_DASHBOARD_PATH);
    revalidatePath(`/workspace/campaigns/${campaignId}`);

    return {
      ok: true,
      data: {
        id: campaignId,
        name: name ?? existing.name,
        status: status ?? existing.status,
        createdAt: existing.createdAt.toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: null,
      },
    };
  } catch (error) {
    return toActionError(error, "updateCampaign", {
      organizationId,
      campaignId,
    });
  }
}

export async function deleteCampaign(
  input: DeleteCampaignInput,
): Promise<ActionResult<{ campaignId: string }>> {
  const parsed = deleteCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const { organizationId, campaignId } = parsed.data;

  try {
    const actor = await requireOrgPermission(
      organizationId,
      WORKSPACE_ROLE_MATRIX.manageCampaigns,
    );

    // funnels.campaignId has onDelete: "cascade" — deleting the campaign
    // row cascades its funnels at the DB level, no manual cleanup needed.
    const [result] = await db
      .delete(campaign)
      .where(
        and(
          eq(campaign.id, campaignId),
          eq(campaign.organizationId, organizationId),
        ),
      );

    if (result.affectedRows === 0) {
      throw new NotFoundError("Campaign not found in this workspace.", {
        campaignId,
      });
    }

    logger.info("Campaign deleted", {
      organizationId,
      campaignId,
      actorId: actor.userId,
    });
    revalidatePath(WORKSPACE_DASHBOARD_PATH);

    return { ok: true, data: { campaignId } };
  } catch (error) {
    return toActionError(error, "deleteCampaign", {
      organizationId,
      campaignId,
    });
  }
}
