import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import mysql from "mysql2/promise";

//export const db = drizzle(process.env.DATABASE_URL!, { schema });

// 1. Create a connection pool using the connection string.
// Using a pool is highly recommended for Next.js/Node.js to handle concurrency.
const pool = mysql.createPool(process.env.DATABASE_URL!);

// 2. Initialize Drizzle by passing the pool object to the 'client' property.
export const db = drizzle(pool, { schema, mode: "default" });

// Note: If you prefer to use a single connection instead of a pool,
// the initialization would look like this (less recommended for Next.js):
// const connection = await mysql.createConnection(process.env.DATABASE_URL!);
// export const db = drizzle(connection, { schema });
