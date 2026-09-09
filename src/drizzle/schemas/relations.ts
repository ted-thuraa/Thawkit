// path: src/drizzle/schemas/relations.ts

// db/schemas/relations.ts

import { relations } from "drizzle-orm";
import * as auth from "./auth-schema";
import * as campaigns from "./campaigns-schema";
import * as designSystem from "./design-system-schema";
import * as funnelContent from "./funnel-content-schema";

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
  createdCampaigns: many(campaigns.campaign, {
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
    campaigns: many(campaigns.campaign, {
      relationName: "organizationCampaigns",
    }),
    funnels: many(campaigns.funnel, {
      relationName: "organizationFunnels",
    }),
    components: many(designSystem.component, {
      relationName: "organizationComponents",
    }),
    layerStyles: many(designSystem.layerStyle, {
      relationName: "organizationLayerStyles",
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
  campaigns.campaign,
  ({ one, many }) => ({
    organization: one(auth.organization, {
      fields: [campaigns.campaign.organizationId],
      references: [auth.organization.id],
      relationName: "organizationCampaigns",
    }),
    // ADDED: powers `listCampaigns`' `with: { creator: ... }` join used to
    // populate CampaignDTO.createdBy on the /workspace dashboard.
    creator: one(auth.user, {
      fields: [campaigns.campaign.createdBy],
      references: [auth.user.id],
      relationName: "campaignCreator",
    }),
    funnels: many(campaigns.funnel, {
      relationName: "campaignFunnels",
    }),
  }),
);

// ── Funnel Relations ────────────────────────────────────────────────────────
export const funnelRelations = relations(campaigns.funnel, ({ one, many }) => ({
  organization: one(auth.organization, {
    fields: [campaigns.funnel.organizationId],
    references: [auth.organization.id],
    relationName: "organizationFunnels",
  }),
  campaign: one(campaigns.campaign, {
    fields: [campaigns.funnel.campaignId],
    references: [campaigns.campaign.id],
    relationName: "campaignFunnels",
  }),
  pages: many(funnelContent.pages, {
    relationName: "funnelPages",
  }),
  funnelVersions: many(funnelContent.funnelVersions, {
    relationName: "funnelVersions",
  }),
  questionCategories: many(funnelContent.questionCategories, {
    relationName: "funnelQuestionCategories",
  }),
}));

// ── Funnel Version Relations ────────────────────────────────────────────────
export const funnelVersionsRelations = relations(
  funnelContent.funnelVersions,
  ({ one }) => ({
    funnel: one(campaigns.funnel, {
      fields: [funnelContent.funnelVersions.funnelId],
      references: [campaigns.funnel.id],
      relationName: "funnelVersions",
    }),
  }),
);

// ── Page Relations ──────────────────────────────────────────────────────────
export const pagesRelations = relations(funnelContent.pages, ({ one }) => ({
  funnel: one(campaigns.funnel, {
    fields: [funnelContent.pages.funnelId],
    references: [campaigns.funnel.id],
    relationName: "funnelPages",
  }),
}));

// ── Question Category Relations ─────────────────────────────────────────────
export const questionCategoriesRelations = relations(
  funnelContent.questionCategories,
  ({ one }) => ({
    funnel: one(campaigns.funnel, {
      fields: [funnelContent.questionCategories.funnelId],
      references: [campaigns.funnel.id],
      relationName: "funnelQuestionCategories",
    }),
  }),
);

// ── Audience Relations ──────────────────────────────────────────────────────
// CHANGED (this pass): now belongs to `campaign`, not `funnel` — see the
// decision note in funnel-content-schema.ts.
export const audiencesRelations = relations(
  funnelContent.audiences,
  ({ one }) => ({
    funnel: one(campaigns.campaign, {
      fields: [funnelContent.audiences.funnelId],
      references: [campaigns.campaign.id],
      relationName: "campaignAudiences",
    }),
  }),
);

// ── Component Relations ─────────────────────────────────────────────────────
export const componentRelations = relations(
  designSystem.component,
  ({ one }) => ({
    organization: one(auth.organization, {
      fields: [designSystem.component.organizationId],
      references: [auth.organization.id],
      relationName: "organizationComponents",
    }),
  }),
);

// ── Layer Style Relations ───────────────────────────────────────────────────
export const layerStyleRelations = relations(
  designSystem.layerStyle,
  ({ one }) => ({
    organization: one(auth.organization, {
      fields: [designSystem.layerStyle.organizationId],
      references: [auth.organization.id],
      relationName: "organizationLayerStyles",
    }),
  }),
);
