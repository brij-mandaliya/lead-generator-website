import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { logger } from "./lib/logger";
import { configureGooglePassport } from "./lib/passport";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import plansRouter from "./routes/plans";
import leadsRouter from "./routes/leads";
import paymentsRouter from "./routes/payments";
import analyticsRouter from "./routes/analytics";

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Validate Google OAuth environment variables
const googleOAuthConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (!googleOAuthConfigured) {
  logger.warn("Google OAuth credentials not configured. Google sign-in will be disabled.");
} else {
  logger.info("Google OAuth credentials found. Google sign-in enabled.");

  if (!process.env.GOOGLE_CALLBACK_URL) {
    logger.warn("Google OAuth callback URL not configured. Using default.");
    process.env.GOOGLE_CALLBACK_URL = "http://localhost:5173/api/auth/google/callback";
  }

  if (!process.env.FRONTEND_URL) {
    logger.warn("Frontend URL not configured. Using default for OAuth callback.");
    process.env.FRONTEND_URL = "http://localhost:5173";
  }

  configureGooglePassport();
  app.use(passport.initialize());
}

app.get("/api/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/plans", plansRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/analytics", analyticsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err, url: req.originalUrl }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

export default app;
