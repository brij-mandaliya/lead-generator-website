import app from "./app";
import { runMigrations } from "@workspace/db/migrate";
import { initializeGoogleSheetsService } from "@workspace/google-sheets";
import { initializeEmailService } from "./lib/email";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  await runMigrations();
  logger.info("Migrations complete");

  await initializeGoogleSheetsService().catch((err) => {
    logger.error({ err }, "Google Sheets service init failed — sheets disabled");
  });

  initializeEmailService();

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

start().catch((err) => {
  logger.error({ err }, "Startup failed");
  process.exit(1);
});