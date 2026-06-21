import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";
import path from "node:path";
import { fileURLToPath } from "node:url";

const resolvedDir = globalThis.__dirname
  ?? path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: path.join(resolvedDir, "./migrations"),
  });
}
