import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const { DB_HOST, DB_USER, DB_PASS, DB_DATABASE, DB_PORT } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASS || !DB_DATABASE) {
  throw new Error(
    "DB_HOST, DB_USER, DB_PASS, and DB_DATABASE must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  port: Number(DB_PORT) || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
