// db/schema/quiz.ts
import {
  mysqlTable,
  varchar,
  timestamp,
  text,
  boolean,
  int,
  float,
  json,
  longtext,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// --- PARENT TABLE ---
export const projects = mysqlTable("project", {
  id: varchar("id", { length: 191 }).primaryKey(),
  ref: varchar("ref", { length: 191 }).unique().notNull(),
  domain: varchar("domain", { length: 191 }).unique().notNull(),
  type: mysqlEnum("project_type", ["score_quiz", "gpt_wrapper"]),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  showBrandingLogo: boolean("show_branding_logo").default(true).notNull(),
  draftMode: boolean("draft_mode").default(true).notNull(),
  thumbnail: text("thumbnail"), // delete this later
  previewImage: varchar("preview_image", { length: 255 }),
  visits: int("visits").default(0).notNull(),
  interactions: int("interactions").default(0).notNull(),
  conversionRate: float("conversion_rate").default(0.0).notNull(),
  leads: int("leads").default(0).notNull(),
  submissions: int("submissions").default(0).notNull(),
  organizationId: varchar("organization_id", { length: 191 }).notNull(),
  questionOrder: mysqlEnum("question_order", [
    "asc_categories",
    "asc",
    "branching_logic",
    "random",
  ])
    .default("asc_categories")
    .notNull(),
  settings: json("settings"),
  leadOptinForm: json("lead_optin_form"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  expireDate: timestamp("expire_date"),
});

// --- CHILD TABLES (Directly related to Project) ---

export const projectFiles = mysqlTable("media", {
  id: varchar("id", { length: 191 }).primaryKey(),
  type: varchar("type", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  link: varchar("link", { length: 191 }).unique().notNull(),
  size: int("size").default(0),
  mime_type: varchar("mime_type", { length: 50 }),
  storage_provider: varchar("storage_provider", { length: 50 }).default(
    "uploadthing"
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  organizationId: varchar("organization_id", { length: 191 }).notNull(),
  // UPDATED: Cascade delete on project removal
  projectId: varchar("project_id", { length: 191 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

export const projectQuizFields = mysqlTable("project_quiz_field", {
  id: varchar("id", { length: 191 }).primaryKey(),
  order: int("order").notNull(),
  title: varchar("title", { length: 255 })
    .default("Type your qustion here")
    .notNull(),
  description: text("description"),
  formFieldType: mysqlEnum("form_field_type", [
    "LEAD_FORM_ITEM",
    "QUESTION_ITEM",
    "INFO_ITEM",
  ])
    .default("QUESTION_ITEM")
    .notNull(),
  type: mysqlEnum("question_type", [
    "TEXT",
    "YES_NO",
    "MULTIPLE_CHOICE",
    "RANGE",
    "CONTACT_FORM",
    "INFO_SCREEN",
    "IMAGE_BUTTON",
  ])
    .default("YES_NO")
    .notNull(),
  context: mysqlEnum("question_context", [
    "Landing_Page",
    "Quiz_Page",
    "Result_Page",
  ])
    .default("Quiz_Page")
    .notNull(),
  displayPage: mysqlEnum("display_page", [
    "Landing_Page",
    "Quiz_Page",
    "Result_Page",
  ])
    .default("Quiz_Page")
    .notNull(),
  attachment: longtext("attachment"),
  validations: longtext("validations"),
  layout: longtext("layout"),
  properties: longtext("properties"),
  logicBranch: longtext("logic_branch"),
  scoring: longtext("scoring"),
  settings: longtext("settings"),
  maxPotentialScore: int("max_potential_score").default(0).notNull(),
  categoryIds: longtext("category_ids"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // UPDATED: Cascade delete on project removal
  projectId: varchar("project_id", { length: 191 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

export const quizFieldCategories = mysqlTable("quiz_field_category", {
  id: varchar("id", { length: 191 }).primaryKey(),
  order: int("order").notNull(),
  icon: varchar("icon", { length: 255 }).default(""),
  title: varchar("title", { length: 255 }),
  description: varchar("description", { length: 255 }),
  // UPDATED: Cascade delete on project removal
  projectId: varchar("project_id", { length: 191 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scoreTiers = mysqlTable("score_tier", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  scoreColour: varchar("score_colour", { length: 255 }).notNull(),
  scoreFrom: int("score_from").notNull(),
  scoreTo: int("score_to").notNull(),
  // UPDATED: Cascade delete on project removal
  projectId: varchar("project_id", { length: 191 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const quizResponses = mysqlTable("quiz_response", {
  id: varchar("id", { length: 191 }).primaryKey(),
  leadData: json("lead_data"),
  idempotencyKey: varchar("idempotency_key", { length: 191 }).unique(),
  ipAddress: varchar("ip_address", { length: 255 }),
  ipAddressCountry: varchar("ip_address_country", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  duration: int("duration"),
  overallScore: float("overall_score"),
  status: mysqlEnum("submission_status", [
    "RECEIVED",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "SPAM",
  ])
    .default("RECEIVED")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  // UPDATED: Cascade delete on project removal
  projectId: varchar("project_id", { length: 191 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

// --- GRANDCHILD TABLES (Must also cascade to avoid FK errors) ---

export const quizFieldOptions = mysqlTable("quiz_field_option", {
  id: varchar("id", { length: 191 }).primaryKey(),
  order: int("order").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  mediaType: mysqlEnum("mediaType", ["image"]).default("image"),
  mediaSrc: varchar("media_src", { length: 255 }),
  showIcon: boolean("showIcon").default(false).notNull(),
  // UPDATED: Cascade delete if the field is deleted
  projectQuizFieldId: varchar("project_quiz_field_id", { length: 191 })
    .notNull()
    .references(() => projectQuizFields.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const quizAnswers = mysqlTable("quiz_answer", {
  id: varchar("id", { length: 191 }).primaryKey(),
  // UPDATED: Cascade delete if the response is deleted
  quizResponseId: varchar("quiz_response_id", { length: 191 })
    .notNull()
    .references(() => quizResponses.id, { onDelete: "cascade" }),
  // Note: We usually set null or cascade on field ID depending on if you want to keep answers for deleted questions
  projectQuizFieldId: varchar("project_quiz_field_id", { length: 191 })
    .notNull()
    .references(() => projectQuizFields.id, { onDelete: "cascade" }),
  answer: text("answer"),
  optionId: varchar("option_id", { length: 255 }),
  score: float("score"),
  scorePotential: varchar("score_potential", { length: 255 }),
  timeSpent: int("time_spent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const scores = mysqlTable("score", {
  id: varchar("id", { length: 191 }).primaryKey(),
  categoryId: varchar("category_id", { length: 191 }),
  scoreTierId: varchar("score_tier_id", { length: 191 }),
  score: varchar("score", { length: 255 }),
  scorePotential: varchar("score_potential", { length: 255 }),
  scorePercentage: varchar("score_percentage", { length: 255 }),
  timeSpent: int("time_spent"),
  type: varchar("type", { length: 255 }),
  // UPDATED: Cascade delete if the response is deleted
  quizResponseId: varchar("quiz_response_id", { length: 191 })
    .notNull()
    .references(() => quizResponses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
