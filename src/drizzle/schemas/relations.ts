// db/relations.ts
import { relations } from "drizzle-orm";
import * as auth from "./auth-schema";
import * as projects from "./projects-schema";
import * as funnel from "./funnel-shema";
import { analyticsEvents } from "./analytics";

// User Relations
export const userRelations = relations(auth.user, ({ many }) => ({
  sessions: many(auth.session),
  accounts: many(auth.account),
  twoFactors: many(auth.twoFactor),
  passkeys: many(auth.passkey),
  members: many(auth.member),
  invitation: many(auth.invitation),
}));

// Session Relations
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

// Account Relations
export const accountRelations = relations(auth.account, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.account.userId],
    references: [auth.user.id],
    relationName: "userAccounts",
  }),
}));

// TwoFactor Relations
export const twoFactorRelations = relations(auth.twoFactor, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.twoFactor.userId],
    references: [auth.user.id],
    relationName: "userTwoFactors",
  }),
}));

// Passkey Relations
export const passkeyRelations = relations(auth.passkey, ({ one }) => ({
  user: one(auth.user, {
    fields: [auth.passkey.userId],
    references: [auth.user.id],
    relationName: "userPasskeys",
  }),
}));

// Organization Relations
export const organizationRelations = relations(
  auth.organization,
  ({ many, one }) => ({
    media: many(projects.projectFiles),
    projects: many(projects.projects),
    members: many(auth.member),
    invitation: many(auth.invitation),
    // owner: one(auth.user, {
    //   fields: [auth.organization.ownerId],
    //   references: [auth.user.id],
    // }),
    activeSessions: many(auth.session, {
      relationName: "activeauth.organizationessions",
    }),
  })
);

// Member Relations
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

// Invitation Relations
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

// projects.media Relations
// projectFiles Relations
export const projectFilesRelations = relations(
  projects.projectFiles,
  ({ one }) => ({
    organization: one(auth.organization, {
      fields: [projects.projectFiles.organizationId],
      references: [auth.organization.id],
      relationName: "organizationProjectFiles", // Renamed for clarity
    }),
    // ADDED: Defines the 'many-side' of the relationship
    project: one(projects.projects, {
      fields: [projects.projectFiles.projectId],
      references: [projects.projects.id],
      relationName: "projectFiles", // This name will be used by the 'one-side' (project)
    }),
  })
);

// Project Relations
export const projectRelations = relations(
  projects.projects,
  ({ one, many }) => ({
    organization: one(auth.organization, {
      fields: [projects.projects.organizationId],
      references: [auth.organization.id],
      relationName: "organizationProjects",
    }),
    quizFieldCategories: many(projects.quizFieldCategories),
    projectQuizFields: many(projects.projectQuizFields),

    quizResponses: many(projects.quizResponses),
    scoreTiers: many(projects.scoreTiers),
    funnel: one(funnel.funnels, {
      fields: [projects.projects.id],
      references: [funnel.funnels.projectId],
      relationName: "projectFunnel",
    }),
    // ADDED: Defines the 'one-side' of the relationship
    projectFiles: many(projects.projectFiles),
  })
);

// Funnel Relations (One-to-One with Project enforced by PK)
export const funnelRelations = relations(funnel.funnels, ({ one, many }) => ({
  project: one(projects.projects, {
    fields: [funnel.funnels.projectId],
    references: [projects.projects.id],
    relationName: "funnelProject",
  }),
  funnelPages: many(funnel.funnelPages),
  classNames: many(funnel.classNames),
}));

// Project Quiz Field Relations
export const projectQuizFieldRelations = relations(
  projects.projectQuizFields,
  ({ one, many }) => ({
    project: one(projects.projects, {
      fields: [projects.projectQuizFields.projectId],
      references: [projects.projects.id],
      relationName: "fieldProject",
    }),
    quizFieldOptions: many(projects.quizFieldOptions),
    quizAnswers: many(projects.quizAnswers),
  })
);

// Quiz Field Option Relations
export const quizFieldOptionRelations = relations(
  projects.quizFieldOptions,
  ({ one }) => ({
    projectQuizField: one(projects.projectQuizFields, {
      fields: [projects.quizFieldOptions.projectQuizFieldId],
      references: [projects.projectQuizFields.id],
      relationName: "optionField",
    }),
  })
);

// Quiz Field Category Relations
export const quizFieldCategoryRelations = relations(
  projects.quizFieldCategories,
  ({ one, many }) => ({
    project: one(projects.projects, {
      fields: [projects.quizFieldCategories.projectId],
      references: [projects.projects.id],
      relationName: "categoryProject",
    }),
    scores: many(projects.scores),
  })
);

// Score Tier Relations
export const scoreTierRelations = relations(
  projects.scoreTiers,
  ({ one, many }) => ({
    project: one(projects.projects, {
      fields: [projects.scoreTiers.projectId],
      references: [projects.projects.id],
      relationName: "tierProject",
    }),
    scores: many(projects.scores),
  })
);

// Quiz Response Relations
export const quizResponseRelations = relations(
  projects.quizResponses,
  ({ one, many }) => ({
    project: one(projects.projects, {
      fields: [projects.quizResponses.projectId],
      references: [projects.projects.id],
      relationName: "responseProject",
    }),

    quizAnswers: many(projects.quizAnswers),
    scores: many(projects.scores),
  })
);

// Quiz Answer Relations
export const quizAnswerRelations = relations(
  projects.quizAnswers,
  ({ one }) => ({
    quizResponse: one(projects.quizResponses, {
      fields: [projects.quizAnswers.quizResponseId],
      references: [projects.quizResponses.id],
      relationName: "answerResponse",
    }),
    projectQuizField: one(projects.projectQuizFields, {
      fields: [projects.quizAnswers.projectQuizFieldId],
      references: [projects.projectQuizFields.id],
      relationName: "answerField",
    }),
  })
);

// Score Relations
export const scoreRelations = relations(projects.scores, ({ one }) => ({
  quizResponse: one(projects.quizResponses, {
    fields: [projects.scores.quizResponseId],
    references: [projects.quizResponses.id],
    relationName: "scoreResponse",
  }),
  category: one(projects.quizFieldCategories, {
    fields: [projects.scores.categoryId],
    references: [projects.quizFieldCategories.id],
    relationName: "scoreCategory",
  }),
  scoreTier: one(projects.scoreTiers, {
    fields: [projects.scores.scoreTierId],
    references: [projects.scoreTiers.id],
    relationName: "scoreTier",
  }),
}));

// Class Name Relations
export const classNameRelations = relations(funnel.classNames, ({ one }) => ({
  funnel: one(funnel.funnels, {
    fields: [funnel.classNames.funnelId],
    references: [funnel.funnels.id],
    relationName: "classNameFunnel",
  }),
}));

// Funnel Page Relations
export const funnelPageRelations = relations(funnel.funnelPages, ({ one }) => ({
  funnel: one(funnel.funnels, {
    fields: [funnel.funnelPages.funnelId],
    references: [funnel.funnels.id],
    relationName: "pageFunnel",
  }),
}));

export const analyticsRelations = relations(analyticsEvents, ({ one }) => ({
  project: one(projects.projects, {
    fields: [analyticsEvents.projectId],
    references: [projects.projects.id],
  }),
}));
