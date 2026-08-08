// db/schemas/campaigns-schema.ts

/**
 * ─────────────────────────────────────────────────────────────────────────
 * TENANCY: "organization" (auth-schema.ts, Better-Auth) IS the workspace
 * entity throughout ThawKit — there is no separate `workspace` table.
 * Every "workspace" reference in comments/docs means a row in `organization`.
 * See architecture roadmap Module 1 (Multi-Tenant Data & Identity Foundation).
 *
 * DIALECT: MySQL for local development now; production is planned to move
 * to PostgreSQL later. This file is intentionally MySQL-only for the
 * moment — dialect-specific constructs are called out inline so the future
 * pg-core rewrite knows exactly what to re-derive rather than guess:
 *   - `mysqlEnum("status", [...])`  → becomes a `pgEnum` defined once and
 *     reused, or a `varchar` + CHECK constraint, depending on how much
 *     schema-evolution flexibility is wanted at that point.
 *   - `datetime()` + `sql\`CURRENT_TIMESTAMP\`` default → becomes
 *     `timestamp()` + `.defaultNow()` (Postgres doesn't have MySQL's
 *     TIMESTAMP-vs-DATETIME 2038 ceiling, so the workaround this file uses
 *     for MySQL is simply unnecessary in Postgres).
 *   - `json()` → becomes `jsonb()` (indexable, and what every JSON column
 *     in this file should become — GIN indexing on `settings`/`content`
 *     columns is a real win Postgres unlocks that MySQL's JSON type can't
 *     match without generated/virtual columns).
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
  mysqlEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { organization } from "./auth-schema";
import type {
  FunnelTheme,
  LeadFormConfig,
  FunnelCalculations,
  ScoreTier,
} from "@/types/PageCMS/pageSchema";

// ─── Campaigns ──────────────────────────────────────────────────────────────
//
// A Campaign is a ThawKit-specific grouping wrapper around one or more
// Funnels — e.g. a seasonal re-run, an A/B variant set, or a themed
// grouping with its own expiry/settings. It sits ABOVE the core
// Workspace → Funnel relationship defined in the architecture roadmap's
// Module 2 (that roadmap has no "Campaign" concept — it's a ThawKit-level
// organizational layer on top of the documented domain model).

export const campaigns = mysqlTable(
  "campaign",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    ref: varchar("ref", { length: 191 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    organizationId: varchar("organization_id", { length: 191 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    settings: json("settings"),

    // FIX (Phase 1): `.defaultNow()` only exists on `timestamp()`'s builder
    // subclass in Drizzle's MySQL dialect — it silently doesn't apply to
    // `datetime()`. Using `datetime()` (not `timestamp()`) here deliberately,
    // to avoid MySQL TIMESTAMP's 2038-01-19 ceiling on a row type that can
    // legitimately live for years (campaigns aren't ephemeral like sessions).
    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
    expireDate: datetime("expire_date"),
  },
  (t) => ({
    orgIdx: index("campaign_org_idx").on(t.organizationId),
  }),
);

// ─── Funnels ────────────────────────────────────────────────────────────────

export const funnels = mysqlTable(
  "funnel",
  {
    id: varchar("id", { length: 191 }).unique().notNull().primaryKey(),

    // ── Tenant scope (Phase 2: Multi-Tenancy Hardening) ─────────────────
    // FIX: denormalized directly onto funnels rather than inferred
    // transitively through `campaignId -> campaigns.organizationId`.
    // Funnels are the most frequently queried table in the whole domain
    // (builder loads, publish-time compilation, CRM joins) — with this
    // column, every tenant-scoped query becomes a single indexed equality
    // check with NO join required to establish the security boundary
    // itself. This is the concrete fix for architecture roadmap Module 1's
    // requirement that isolation be enforced at the data-access layer, not
    // recovered after the fact from a join a future hand-written query
    // might drop. See db/queries/tenant-scope.ts for the access wrapper
    // that relies on this column existing directly here.
    organizationId: varchar("organization_id", { length: 191 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    // DECISION (Phase 2): `.unique()` removed from campaignId. Previously
    // this forced a strict 1:1 Campaign <-> Funnel relationship, but a
    // Campaign (seasonal grouping / A/B variant set, per the comment above
    // `campaigns`) should reasonably be able to contain more than one
    // Funnel. Flagging this as a deliberate decision made during the audit,
    // not a silent behavior change — if a strict 1:1 really is intended,
    // re-add `.unique()` here.
    campaignId: varchar("campaign_id", { length: 191 })
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),

    // NEW (Phase 3): base URL path for the funnel, e.g. "/stepper" —
    // matches `funnelPayloadSchema.slug`. Distinct from a page's own
    // (full) `slug` on the `pages` table below. Scoped unique per
    // workspace, not globally — two different workspaces on two different
    // custom domains are free to both use "/stepper" as their base path.
    slug: varchar("slug", { length: 191 }).notNull(),

    title: varchar("title", { length: 255 }),
    description: varchar("description", { length: 255 }),
    domain: varchar("domain", { length: 191 }).unique(),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
    // NEW (Phase 3): matches `funnelPayloadSchema.published_at` — set once
    // by the publish action (the same one that writes a new row into
    // `funnel_versions`), left null for funnels that have never gone live.
    publishedAt: datetime("published_at"),

    // FIX (Phase 1): previously `published: boolean`. The frontend's
    // `funnelPayloadSchema.status` (pageSchema.ts) is a three-state union —
    // "draft" | "published" | "archived" — which a boolean cannot represent
    // at all; "archived" would have silently collapsed into either true or
    // false with no way to tell it apart from a normal unpublished draft.
    // This enum now matches the frontend contract exactly, field for field.
    status: mysqlEnum("status", ["draft", "published", "archived"])
      .default("draft")
      .notNull(),

    // NEW (Phase 3): the funnel-root author-time config trees — theme,
    // lead capture form, calc-engine variable definitions, and the score
    // tier ladder. All four follow the exact same reasoning as `sections`
    // on the `pages` table (funnel-content-schema.ts): nothing queries
    // into these by field via SQL anywhere in the app, they're always read
    // and written as a whole tree by the frontend, so a JSON column with a
    // $type<>() annotation gets full compile-time shape-checking with none
    // of the join overhead a normalized version would cost for zero query
    // benefit. Column names intentionally mirror the frontend's own
    // snake_case field name (`lead_form`) where one exists, so the
    // compiler's mapping stays a straight assignment rather than a rename.
    theme: json("theme").$type<FunnelTheme>(),
    leadForm: json("lead_form").$type<LeadFormConfig>(),
    calculations: json("calculations").$type<FunnelCalculations>(),
    scoreTiers: json("score_tiers").$type<ScoreTier[]>(),

    subDomainName: varchar("sub_domain_name", { length: 191 })
      .unique()
      .notNull(),
    favicon: text("favicon"),
  },
  (t) => ({
    orgIdx: index("funnel_org_idx").on(t.organizationId),
    campaignIdx: index("funnel_campaign_idx").on(t.campaignId),
    slugUnique: uniqueIndex("funnel_org_slug_idx").on(t.organizationId, t.slug),
  }),
);
