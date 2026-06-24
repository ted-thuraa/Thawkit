import {
  mysqlTable,
  text,
  timestamp,
  boolean,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  role: varchar("role", { length: 255 }),
  banned: boolean("banned").default(false),
  banReason: varchar("ban_reason", { length: 255 }),
  banExpires: timestamp("ban_expires"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: varchar("impersonated_by", { length: 255 }),
  activeOrganizationId: varchar("active_organization_id", { length: 255 }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const twoFactor = mysqlTable("two_factor", {
  id: varchar("id", { length: 255 }).primaryKey(),
  secret: varchar("secret", { length: 255 }).notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const passkey = mysqlTable("passkey", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  publicKey: text("public_key").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialID: varchar("credential_id", { length: 255 }).notNull(),
  counter: int("counter").notNull(),
  deviceType: varchar("device_type", { length: 255 }).notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: varchar("transports", { length: 255 }),
  createdAt: timestamp("created_at"),
  aaguid: varchar("aaguid", { length: 255 }),
});

export const organization = mysqlTable("organization", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  // ownerId: varchar("ownerId", { length: 255 }).unique().notNull(),
  logo: varchar("logo", { length: 255 }),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = mysqlTable("member", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 255 }).default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = mysqlTable("invitation", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  status: varchar("status", { length: 255 }).default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: varchar("inviter_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const subscription = mysqlTable("subscription", {
  id: varchar("id", { length: 255 }).primaryKey(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 255 }).notNull(),
  recurringInterval: varchar("recurring_interval", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),

  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),

  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  canceledAt: timestamp("canceled_at"),
  startedAt: timestamp("started_at").notNull(),
  endsAt: timestamp("ends_at"),
  endedAt: timestamp("ended_at"),

  customerId: varchar("customer_id", { length: 255 }).notNull(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  discountId: varchar("discount_id", { length: 255 }),
  checkoutId: varchar("checkout_id", { length: 255 }).notNull(),

  customerCancellationReason: text("customer_cancellation_reason"),
  customerCancellationComment: text("customer_cancellation_comment"),

  metadata: text("metadata"), // JSON string
  customFieldData: text("custom_field_data"), // JSON string

  createdAt: timestamp("created_at").defaultNow().notNull(),
  modifiedAt: timestamp("modified_at")
    .$onUpdate(() => new Date())
    .notNull(),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
