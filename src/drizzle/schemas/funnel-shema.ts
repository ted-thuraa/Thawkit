// db/schema/funnel.ts
import {
  mysqlTable,
  varchar,
  timestamp,
  text,
  boolean,
  json,
  longtext,
  int,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { projects } from "./projects-schema";

export const funnels = mysqlTable("funnel", {
  id: varchar("id", { length: 191 }).unique().notNull().primaryKey(),
  // UPDATED: Cascade delete on project removal
  projectId: varchar("project_id", { length: 191 })
    .unique()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  domain: varchar("domain", { length: 191 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  description: varchar("description", { length: 255 }),
  published: boolean("published").default(false).notNull(),
  subDomainName: varchar("sub_domain_name", { length: 191 }).unique().notNull(),
  favicon: text("favicon"),
});

export const classNames = mysqlTable("class_name", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  // UPDATED: Cascade delete if the funnel is deleted
  funnelId: varchar("funnel_id", { length: 191 })
    .notNull()
    .references(() => funnels.id, { onDelete: "cascade" }),
  customData: longtext("custom_data"),
});

export const funnelPages = mysqlTable("funnel_page", {
  id: varchar("id", { length: 191 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("funnel_page_type", [
    "Landing_Page",
    "Quiz_Page",
    "Result_Page",
  ]).notNull(),
  status: mysqlEnum("funnel_page_status", ["Draft", "Published"])
    .default("Draft")
    .notNull(),
  defaultPage: boolean("default_page").default(false).notNull(),
  order: int("order").notNull(),
  pathName: varchar("path_name", { length: 255 }).default("").notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: longtext("meta_description"),
  visits: int("visits").default(0).notNull(),
  previewImage: varchar("preview_image", { length: 255 }),
  scripts: json("scripts"),
  theme: longtext("theme"),
  settings: longtext("settings"),
  content: longtext("content"),
  // UPDATED: Cascade delete if the funnel is deleted
  funnelId: varchar("funnel_id", { length: 191 })
    .notNull()
    .references(() => funnels.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
