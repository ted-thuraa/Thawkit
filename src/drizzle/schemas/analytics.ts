import {
  mysqlTable,
  varchar,
  timestamp,
  text,
  json,
  index,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { projects } from "./projects-schema";

// ---------------------------------------------------------
// 1. Analytics Event Log (MySQL)
// ---------------------------------------------------------
export const analyticsEvents = mysqlTable(
  "analytics_events",
  {
    id: varchar("id", { length: 36 }).primaryKey(), // UUID generated in app
    projectId: varchar("project_id", { length: 191 })
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    funnelPageId: varchar("funnel_page_id", { length: 191 }), // Links to funnelPages.id

    // Event Definition
    eventType: varchar("event_type", { length: 50 }).notNull(), // 'page_view', 'conversion'
    eventName: varchar("event_name", { length: 100 }), // e.g. 'quiz_start_button'

    // Visitor Identity (Privacy Preserved)
    visitorId: varchar("visitor_id", { length: 64 }).notNull(), // Persistent ID (Cookie/Local storage)
    sessionId: varchar("session_id", { length: 64 }).notNull(), // Ephemeral ID (Tab/Window)
    ipHash: varchar("ip_hash", { length: 64 }), // SHA-256(IP + Salt)

    // Demographics & Context
    country: varchar("country", { length: 2 }), // ISO 3166-1 alpha-2
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    deviceType: varchar("device_type", { length: 20 }), // mobile, desktop

    // Metadata
    metadata: json("metadata"), // MySQL JSON type for flexible data

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // High-performance indexes for aggregation queries
    projectIdx: index("idx_analytics_project").on(table.projectId),
    eventTimeIdx: index("idx_analytics_time").on(table.createdAt),
    visitorIdx: index("idx_analytics_visitor").on(table.visitorId),
  })
);
