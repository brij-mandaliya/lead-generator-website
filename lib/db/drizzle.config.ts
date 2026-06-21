import { defineConfig } from "drizzle-kit";
import path from "path";

const { DB_HOST, DB_USER, DB_PASS, DB_DATABASE, DB_PORT } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASS || !DB_DATABASE) {
  throw new Error(
    "DB_HOST, DB_USER, DB_PASS, and DB_DATABASE must be set. Did you forget to provision a database?",
  );
}

const ssl = process.env["DB_SSL"] === "true"
  ? { rejectUnauthorized: false }
  : false;

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_DATABASE,
    port: Number(DB_PORT) || 5432,
    ssl,
  },
});
