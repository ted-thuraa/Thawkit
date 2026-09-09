// path: src/drizzle/schemas/campaigns-schema.ts

import {
  mysqlTable,
  varchar,
  mysqlEnum,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";
import { organization, user } from "./auth-schema";

export const campaignStatusValues = ["draft", "live", "archived"] as const;
export type CampaignStatusValue = (typeof campaignStatusValues)[number];

export const campaign = mysqlTable(
  "campaigns",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    status: mysqlEnum("status", campaignStatusValues)
      .default("draft")
      .notNull(),
    createdBy: varchar("created_by", { length: 255 }).references(
      () => user.id,
      { onDelete: "set null" },
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Serves: WHERE organization_id = ? [AND status = ?] ORDER BY created_at DESC, id DESC
    // — the exact predicate + sort used by listCampaigns' keyset pagination.
    orgStatusCreatedIdx: index("campaigns_org_status_created_idx").on(
      table.organizationId,
      table.status,
      table.createdAt,
      table.id,
    ),
  }),
);

export const funnel = mysqlTable(
  "funnels",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 255 })
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    campaignId: varchar("campaign_id", { length: 255 })
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    orgIdx: index("funnels_organization_id_idx").on(table.organizationId),
    campaignIdx: index("funnels_campaign_id_idx").on(table.campaignId),
  }),
);
