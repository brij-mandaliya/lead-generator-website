import { Router } from "express";
import { db, usersTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import passport from "passport";
import { hashPassword, createToken, authenticate } from "../lib/auth";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, company, phone } = req.body;
    if (!name || !email || !password || password.length < 6) {
      res.status(400).json({ error: "Name, email, and password (min 6 chars) required" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const [user] = await db.insert(usersTable).values({
      name, email, password: hashPassword(password),
      company, phone, role: "user",
    }).returning();
    const token = createToken(user.id);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, planId: user.planId, company: user.company, phone: user.phone, services: user.services, createdAt: user.createdAt },
      token,
    });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || user.password !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    if (!user.isActive) {
      res.status(403).json({ error: "Account is deactivated" });
      return;
    }
    const token = createToken(user.id);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, planId: user.planId, company: user.company, phone: user.phone, services: user.services, createdAt: user.createdAt },
      token,
    });
  } catch (err) { next(err); }
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const [user] = await db.select({
      id: usersTable.id, name: usersTable.name, email: usersTable.email,
      role: usersTable.role, isActive: usersTable.isActive, planId: usersTable.planId,
      company: usersTable.company, phone: usersTable.phone, services: usersTable.services,
      createdAt: usersTable.createdAt,
    }).from(usersTable).where(eq(usersTable.id, req.user!.id));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    let plan = null;
    if (user.planId) {
      const [p] = await db.select().from(plansTable).where(eq(plansTable.id, user.planId));
      plan = p || null;
    }
    res.json({ ...user, plan });
  } catch (err) { next(err); }
});

function googleAuth(strategy: string, options: object) {
  const passportMw = passport.authenticate(strategy, options);
  return (req: any, res: any, next: any) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(501).json({ error: "Google sign-in is not configured on this server." });
      return;
    }
    passportMw(req, res, next);
  };
}

// Google OAuth initiation
router.get("/google", googleAuth("google", { scope: ["profile", "email"], session: false }));

// Google OAuth callback
router.get(
  "/google/callback",
  googleAuth("google", {
    failureRedirect: (process.env.FRONTEND_URL || "http://localhost:5173") + "/login",
    session: false,
  }),
  (req: any, res): void => {
    const { user } = req;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback?token=${user.token}`);
  }
);

// Unlink Google account
router.post("/unlink-google", authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.password || user.password.length === 0) {
      res.status(400).json({
        error:
          "Cannot unlink Google account: no password set. Please set a password using the /auth/password-update endpoint first.",
      });
      return;
    }

    await db
      .update(usersTable)
      .set({ googleId: null, googlePictureUrl: null })
      .where(eq(usersTable.id, userId));

    res.json({ message: "Google account unlinked successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
