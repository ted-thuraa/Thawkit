// path: src/drizzle/schemas/design-system-schema.ts

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Organization-scoped, reusable editor design assets: `component` (a
 * saved, reusable Layer subtree — Ycode's "Component") and `layer_style`
 * (a reusable combo-class chip — Ycode's "LayerStyle"). Ported from Ycode
 * (github.com/ycode/ycode, MIT licensed), see types/PageCMS/layerSchema.ts
 * for the shared `Layer`/`DesignProperties`/`LayerStyle`/`Component` types.
 *
 * TENANCY (deliberately different pattern than funnel-content-schema.ts):
 * these carry a DIRECT `organizationId` FK, the same pattern
 * campaigns-schema.ts's `campaign` table uses, rather than the "always
 * reached through funnelId" indirect pattern the rest of the funnel
 * content domain uses. That's intentional, not an inconsistency — a
 * component or style here is meant to be reusable across every campaign
 * and funnel in a workspace (a shared design-system asset), not content
 * that belongs to one funnel. Scoping it through `funnelId` would make
 * reuse across funnels impossible without either duplicating the row per
 * funnel or introducing a many-to-many join table; a direct org FK is the
 * simpler, correct model for something explicitly meant to be shared
 * workspace-wide.
 *
 * VERSIONING: unlike Ycode's own `Component`/`LayerStyle`, these tables
 * carry no `content_hash`/`is_published`/`deleted_at`. Ycode needs those
 * because a component/style row there is both its own draft and its own
 * live copy (the same dual-row shadow pattern its `pages`/`page_layers`
 * use). Thawkit's publish model is different: `pages` (and therefore
 * anything a page's layer tree references, including component/style ids)
 * is always the mutable draft, and `funnel_versions.compiledSchema`
 * (funnel-content-schema.ts) is the immutable publish snapshot — captured
 * at publish time by compileFunnelPayload(), which resolves component
 * instances and style stacks into the frozen tree. These rows never need
 * their own publish state as a result.
 *
 * DIALECT: MySQL now, PostgreSQL later — same notes as the other schema
 * files apply: `json()` -> `jsonb()`, `datetime()` + `CURRENT_TIMESTAMP`
 * default -> `timestamp()` + `.defaultNow()`, `mysqlEnum` -> `pgEnum`.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  datetime,
  text,
  json,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";
import { organization } from "./auth-schema";
import type {
  Layer,
  ComponentVariant,
  ComponentVariable,
  DesignProperties,
} from "@/types/editor/layerSchema";

export const layerStyleKindValues = ["base", "combo", "global"] as const;
export type LayerStyleKindValue = (typeof layerStyleKindValues)[number];

// ─── Components (reusable layer trees) ──────────────────────────────────────

export const component = mysqlTable(
  "component",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    // Mirrors `variants[0].layers` for convenience — see
    // types/PageCMS/layerSchema.ts's Component doc comment. Kept alongside
    // `variants` rather than derived on every read, matching Ycode's own
    // approach; the compiler is the single place that must keep them in
    // sync on write.
    layers: json("layers").notNull().$type<Layer[]>(),
    // Named layer-tree variants (e.g. "Default", "Small", "Large"). Nullable
    // rather than defaulted to `[{name:"Default",...}]` here — the Server
    // Action that creates a component is responsible for seeding the
    // default variant, not the schema.
    variants: json("variants").$type<ComponentVariant[]>(),
    // Exposed override properties (shared across all variants).
    variables: json("variables").$type<ComponentVariable[]>(),
    // Auto-generated preview thumbnail. Nullable — generated asynchronously
    // after save, not required for a component to function.
    thumbnailUrl: varchar("thumbnail_url", { length: 2048 }),
    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    orgIdx: index("component_org_idx").on(t.organizationId),
  }),
);

// ─── Layer Styles (reusable combo-class chips) ──────────────────────────────

export const layerStyle = mysqlTable(
  "layer_style",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    // Element category (e.g. "text", "block", "button") for scoped
    // filtering in the style picker UI. Named `style_group` (not `group`)
    // to avoid MySQL's reserved `GROUP` keyword as a bare identifier.
    styleGroup: varchar("style_group", { length: 64 }),
    // Role within a combo-class stack: base style, combo addition, or a
    // synced global. Nullable — most styles are implicitly "base".
    kind: mysqlEnum("kind", layerStyleKindValues),
    // Tailwind class string — can be long (many combo classes), so `text`
    // rather than `varchar`.
    classes: text("classes").notNull().default(""),
    design: json("design").$type<DesignProperties>(),
    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    orgIdx: index("layer_style_org_idx").on(t.organizationId),
  }),
);
