// db/schemas/relations.ts

import { relations } from "drizzle-orm";
import * as auth from "./auth-schema";
import * as campaigns from "./campaigns-schema";

// ── User Relations ──────────────────────────────────────────────────────────
export const userRelations = relations(auth.user, ({ many }) => ({
  sessions: many(auth.session),
  accounts: many(auth.account),
  twoFactors: many(auth.twoFactor),
  passkeys: many(auth.passkey),
  members: many(auth.member),
  invitation: many(auth.invitation),
  // FIX (Phase 1): auth-schema.ts's `subscription` table already declared a
  // FK to user.id, but no relation entry existed on either side — this
  // silently blocked `db.query.user.findFirst({ with: { subscriptions: true } })`.
  subscriptions: many(auth.subscription),
}));

// ── Session Relations ───────────────────────────────────────────────────────
export const sessionRelations = relations(auth.session, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.session.userId],
    references: [auth.user.id],
    relationName: "auth.useressions",
  }),
  activeOrganization: one(auth.organization, {
    fields: [auth.session.activeOrganizationId],
    references: [auth.organization.id],
    relationName: "activeauth.organizationessions",
  }),
}));

// ── Account Relations ───────────────────────────────────────────────────────
export const accountRelations = relations(auth.account, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.account.userId],
    references: [auth.user.id],
    relationName: "userAccounts",
  }),
}));

// ── TwoFactor Relations ─────────────────────────────────────────────────────
export const twoFactorRelations = relations(auth.twoFactor, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.twoFactor.userId],
    references: [auth.user.id],
    relationName: "userTwoFactors",
  }),
}));

// ── Passkey Relations ───────────────────────────────────────────────────────
export const passkeyRelations = relations(auth.passkey, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.passkey.userId],
    references: [auth.user.id],
    relationName: "userPasskeys",
  }),
}));

// ── Organization ("Workspace") Relations ────────────────────────────────────
//
// `organization` is Better-Auth's table, but it IS ThawKit's Workspace
// entity per the architecture roadmap (Module 1). Every tenant-owned row in
// the funnel domain — campaigns and funnels today, and every table Phase 3
// introduces (pages, submissions, contacts, audiences, etc.) — carries a
// direct organizationId FK back to this table, per the Phase 2 tenancy
// hardening pattern (see campaigns-schema.ts).
export const organizationRelations = relations(
  auth.organization,
  ({ many }) => ({
    members: many(auth.member),
    invitation: many(auth.invitation),
    activeSessions: many(auth.session, {
      relationName: "activeauth.organizationessions",
    }),
    // ADDED (Phase 2): completes the bidirectional relation now that
    // campaigns/funnels carry direct organizationId FKs.
    campaigns: many(campaigns.campaigns, {
      relationName: "organizationCampaigns",
    }),
    funnels: many(campaigns.funnels, {
      relationName: "organizationFunnels",
    }),
  }),
);

// ── Member Relations ────────────────────────────────────────────────────────
export const memberRelations = relations(auth.member, ({ one }) => ({
  organization: one(auth.organization, {
    fields: [auth.member.organizationId],
    references: [auth.organization.id],
    relationName: "organizationMembers",
  }),
  user: one(auth.user, {
    fields: [auth.member.userId],
    references: [auth.user.id],
    relationName: "userMemberships",
  }),
}));

// ── Invitation Relations ────────────────────────────────────────────────────
export const invitationRelations = relations(auth.invitation, ({ one }) => ({
  organization: one(auth.organization, {
    fields: [auth.invitation.organizationId],
    references: [auth.organization.id],
    relationName: "organizationauth.invitation",
  }),
  inviter: one(auth.user, {
    fields: [auth.invitation.inviterId],
    references: [auth.user.id],
    relationName: "inviterauth.invitation",
  }),
}));

// ── Subscription Relations ──────────────────────────────────────────────────
// ADDED (Phase 1): was entirely missing despite auth-schema.ts already
// defining subscription.userId as a FK to user.id.
export const subscriptionRelations = relations(
  auth.subscription,
  ({ one }) => ({
    user: one(auth.user, {
      fields: [auth.subscription.userId],
      references: [auth.user.id],
      relationName: "userSubscriptions",
    }),
  }),
);

// ── Campaign Relations ──────────────────────────────────────────────────────
export const campaignRelations = relations(
  campaigns.campaigns,
  ({ one, many }) => ({
    organization: one(auth.organization, {
      fields: [campaigns.campaigns.organizationId],
      references: [auth.organization.id],
      relationName: "organizationCampaigns",
    }),
    funnels: many(campaigns.funnels, {
      relationName: "campaignFunnels",
    }),
  }),
);

// ── Funnel Relations ────────────────────────────────────────────────────────
// ADDED (Phase 2): previously did not exist at all — only the campaign→funnel
// direction was declared (as `funnel: many(campaigns.funnels)` on
// campaignRelations), so `db.query.funnels.findFirst({ with: { organization: true } })`
// had no relation to traverse. Now covers both of funnels' FKs.
export const funnelRelations = relations(campaigns.funnels, ({ one }) => ({
  organization: one(auth.organization, {
    fields: [campaigns.funnels.organizationId],
    references: [auth.organization.id],
    relationName: "organizationFunnels",
  }),
  campaign: one(campaigns.campaigns, {
    fields: [campaigns.funnels.campaignId],
    references: [campaigns.campaigns.id],
    relationName: "campaignFunnels",
  }),
}));
