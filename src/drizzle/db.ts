// db/db.ts

import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import mysql from "mysql2/promise";

/**
 * ─── Database Client ────────────────────────────────────────────────────────
 *
 * MySQL for local development today. Production is planned to move to
 * PostgreSQL later — this file (and only this file, plus each `schemas/*.ts`
 * table-definition module) is the intended swap point when that happens:
 *
 *   1. Swap `drizzle-orm/mysql2` → `drizzle-orm/node-postgres` (or
 *      `drizzle-orm/postgres-js`) here, and `mysql2/promise` → `pg`
 *      (or `postgres`).
 *   2. Each `schemas/*.ts` file gets a `pgTable`-based rewrite:
 *        mysqlTable  → pgTable
 *        mysqlEnum   → pgEnum
 *        datetime()  → timestamp()
 *        json()      → jsonb() (gains indexing/containment queries — a
 *                      genuine upside for the AST-heavy calc/branch JSON
 *                      columns introduced in Phase 3)
 *        int()       → integer()
 *   3. Re-run `drizzle-kit generate` against the new dialect and diff the
 *      generated SQL against the MySQL DDL before cutting over, then run
 *      a real data migration (schema shape is designed to be dialect-
 *      agnostic on purpose — no MySQL-only functions are used in queries
 *      anywhere in this codebase).
 *
 * No other module should import `mysql2` (or, later, `pg`) directly —
 * everything else imports `db` from here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Connection pool — sized and configured explicitly rather than relying on
// mysql2 defaults. This runs in a Docker container on a self-hosted Coolify
// VPS (architecture roadmap Module 13), where the DB is frequently a
// separate container reachable only over the internal Docker network —
// silently-dropped idle connections there surface as opaque, hard-to-debug
// query timeouts rather than a clear reconnect.
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  connectionLimit: Number(process.env.DATABASE_POOL_SIZE ?? 10),
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
  // Explicit UTC — `datetime` columns (submission timestamps today;
  // scheduled drip-sequence sends in architecture roadmap Module 10 later)
  // must compare correctly regardless of the host TZ config on whichever
  // container the app server happens to run in.
  timezone: "Z",
});

export const db = drizzle(pool, { schema, mode: "default" });
