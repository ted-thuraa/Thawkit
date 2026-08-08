// db/schemas/funnel-content-schema.ts

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Core domain tables sitting below `funnels` (campaigns-schema.ts) — pages,
 * question categories, audiences, and immutable publish-time snapshots.
 * Together with `funnels`, these are what the compiler
 * (db/compiler/compileFunnelPayload.ts) reassembles into the exact
 * `funnelPayloadSchema` shape the frontend already consumes via
 * `initFunnel(schema)` in store.ts.
 *
 * DECISION (this session): `sections` is stored as a JSON column directly
 * on `pages`, NOT as its own relational table. Nothing outside a section's
 * own page ever references or queries a section independently:
 *   - Every BranchTarget in the schema targets a *page*
 *     (`{ type: "page"; pageId }`), never a section.
 *   - `answers`/`answer_selections` (Phase 4) key on sectionId as a frozen
 *     snapshot reference tied to a funnel_version, not a live FK into an
 *     editable row.
 *   - Every current frontend read (funnelContainer.tsx's
 *     `activePage.sections.map(...)`, helpers.ts's
 *     `schema.pages.flatMap(p => p.sections)`) pulls the WHOLE array per
 *     page — nothing queries "section X in isolation" as its own lookup.
 * A JSON column also makes the mutable draft shape here structurally
 * identical to `funnel_versions.compiledSchema`'s immutable published-
 * snapshot shape, which removes a real chunk of reshaping logic from the
 * compiler (draft and snapshot are the same tree, one is just frozen).
 *
 * The one thing this trades away — SQL-level "find every section using
 * template X across the workspace" — isn't needed by anything in the
 * current roadmap, and gets cheap again for free once this file's `json()`
 * columns become Postgres `jsonb()` with GIN indexing at the production
 * migration.
 *
 * TENANCY: none of these tables carry their own organizationId. They are
 * always reached through `funnelId`, and `funnels.organizationId` (Phase 2)
 * is the single source of truth for tenant scope. Duplicating
 * organizationId down here would just be a second place for it to drift
 * out of sync — every query in this domain should join through `funnels`
 * (see db/queries/tenant-scope.ts's pattern), never trust an independent
 * tenant column at this level.
 *
 * DIALECT: MySQL now, PostgreSQL later — same notes as campaigns-schema.ts
 * apply throughout: `json()` -> `jsonb()`, `datetime()` + `CURRENT_TIMESTAMP`
 * default -> `timestamp()` + `.defaultNow()`, `mysqlEnum` -> `pgEnum`.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  datetime,
  text,
  int,
  json,
  boolean,
  mysqlEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { funnels } from "./campaigns-schema";
import type {
  PageSection,
  PageType,
  AudiencePredicate,
} from "@/types/PageCMS/pageSchema";

// ─── Funnel Versions (immutable publish snapshots) ─────────────────────────
//
// Solves architecture roadmap Module 2's draft-vs-published requirement:
// `funnels` / `pages` / `question_categories` / `audiences` are the MUTABLE
// DRAFT the builder edits; a row here is a frozen, point-in-time
// compilation of that draft, produced by compileFunnelPayload() at publish
// time. Submissions (Phase 4) will reference a specific funnel_version,
// never the live draft directly — so editing scoring weights on a live
// funnel after submissions already exist can never retroactively corrupt a
// past respondent's already-computed score.

export const funnelVersions = mysqlTable(
  "funnel_version",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    funnelId: varchar("funnel_id", { length: 191 })
      .notNull()
      .references(() => funnels.id, { onDelete: "cascade" }),
    versionNumber: int("version_number").notNull(),
    // The exact funnelPayloadSchema shape — the same object initFunnel()
    // already accepts on the frontend today. See compileFunnelPayload.ts.
    compiledSchema: json("compiled_schema").notNull(),
    isCurrent: boolean("is_current").notNull().default(false),
    publishedAt: datetime("published_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    funnelIdx: index("version_funnel_idx").on(t.funnelId),
    versionUnique: uniqueIndex("version_funnel_number_idx").on(
      t.funnelId,
      t.versionNumber,
    ),
    currentIdx: index("version_current_idx").on(t.funnelId, t.isCurrent),
  }),
);

// ─── Pages ──────────────────────────────────────────────────────────────────

export const pages = mysqlTable(
  "page",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    funnelId: varchar("funnel_id", { length: 191 })
      .notNull()
      .references(() => funnels.id, { onDelete: "cascade" }),

    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    order: int("order").notNull(),

    // Matches PagePayloadSchema.pageType exactly — the frontend type still
    // uses "landing_page" (pageSchema.ts SECTION 6), not "main_page", so
    // that's what this enum uses too. If the frontend ever renames it,
    // this enum needs a matching migration in the same PR.
    pageType: mysqlEnum("page_type", [
      "landing_page",
      "normal_page",
      "result_page",
    ])
      .notNull()
      .$type<PageType>(),

    isLinearDefault: boolean("is_linear_default").notNull().default(true),

    // Both nullable JSON — `SEO_Metadata`/`PageConfig` aren't exported from
    // pageSchema.ts (private interfaces), so these are structurally typed
    // via PagePayloadSchema["seo"] / ["config"] at the call site instead of
    // named directly. See compileFunnelPayload.ts.
    seo: json("seo"),
    config: json("config"),

    // DECISION (this session): sections stored as JSON, not a table — see
    // the file-level comment above. Typed via $type<>() so every read/write
    // through Drizzle is checked against the real PageSection[] shape at
    // compile time, even though MySQL itself does no structural validation
    // on the column contents.
    sections: json("sections").notNull().$type<PageSection[]>(),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
    publishedAt: datetime("published_at"),
  },
  (t) => ({
    funnelIdx: index("page_funnel_idx").on(t.funnelId),
    slugUnique: uniqueIndex("page_funnel_slug_idx").on(t.funnelId, t.slug),
    orderIdx: index("page_funnel_order_idx").on(t.funnelId, t.order),
  }),
);

// ─── Question Categories ───────────────────────────────────────────────────
//
// Kept relational (NOT folded into JSON), unlike sections — because,
// unlike a section, a category's id IS referenced independently from
// multiple places outside its own authoring context:
//   - Quiz sections reference categories via `content.categoryIds: string[]`
//   - Audience conditions reference categories via `category_rank` /
//     `category_score` conditions' `categoryId` field
//   - DetailedCategoryResults iterates `questionCategories` directly at the
//     funnel root to decide how many cards to render and in what order
// A stable, independently addressable identity is exactly what a
// relational row buys you that a JSON blob under some other row wouldn't.

export const questionCategories = mysqlTable(
  "question_category",
  {
    // Builder-generated, expected to be globally unique — NOT derived from
    // the title. Two different funnels/workspaces might both legitimately
    // want a category called "About you"; a human-readable slug-style id
    // (as the current mock uses, e.g. "About_you") is not guaranteed
    // unique across funnels, so the builder must mint a real unique id
    // (e.g. a ULID/UUID) and use that consistently everywhere a
    // `categoryId` is referenced.
    id: varchar("id", { length: 191 }).primaryKey(),
    funnelId: varchar("funnel_id", { length: 191 })
      .notNull()
      .references(() => funnels.id, { onDelete: "cascade" }),
    // The mock's category ARRAY ORDER is meaningful (drives
    // DetailedCategoryResults card order) but has no equivalent in a
    // relational row without an explicit column — MySQL gives no ordering
    // guarantee from insertion order alone.
    order: int("order").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 32 }), // emoji or design-system icon_id
  },
  (t) => ({
    funnelIdx: index("category_funnel_idx").on(t.funnelId),
    orderIdx: index("category_funnel_order_idx").on(t.funnelId, t.order),
  }),
);

// ─── Audiences ──────────────────────────────────────────────────────────────
//
// Same reasoning as question_categories: audience IDs are referenced from
// `section.visibility.audienceIds` independently of the audience's own
// authoring context, so they need a stable identity a JSON blob elsewhere
// wouldn't give them. The predicate TREE itself, however, is pure
// author-time config evaluated wholesale in JS
// (evaluateAudiencePredicate in helpers.ts) — same JSON-blob reasoning as
// `sections`, just one level up the schema.

export const audiences = mysqlTable(
  "audience",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    funnelId: varchar("funnel_id", { length: 191 })
      .notNull()
      .references(() => funnels.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    predicate: json("predicate").notNull().$type<AudiencePredicate>(),
    retroactive: boolean("retroactive").notNull().default(false),
    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    funnelIdx: index("audience_funnel_idx").on(t.funnelId),
  }),
);
