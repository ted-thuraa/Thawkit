// path: src/drizzle/schemas/relations.ts

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
  subscriptions: many(auth.subscription),
  // ADDED: reverse side of campaignRelations' `creator` — lets
  // `db.query.user.findFirst({ with: { createdCampaigns: true } })` work.
  createdCampaigns: many(campaigns.campaigns, {
    relationName: "campaignCreator",
  }),
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
export const organizationRelations = relations(
  auth.organization,
  ({ many }) => ({
    members: many(auth.member),
    invitation: many(auth.invitation),
    activeSessions: many(auth.session, {
      relationName: "activeauth.organizationessions",
    }),
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
    // ADDED: powers `listCampaigns`' `with: { creator: ... }` join used to
    // populate CampaignDTO.createdBy on the /workspace dashboard.
    creator: one(auth.user, {
      fields: [campaigns.campaigns.createdBy],
      references: [auth.user.id],
      relationName: "campaignCreator",
    }),
    funnels: many(campaigns.funnels, {
      relationName: "campaignFunnels",
    }),
  }),
);

// ── Funnel Relations ────────────────────────────────────────────────────────
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
