import { Router } from "express";
import { db, usersTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin } from "../lib/auth";

const router = Router();

router.get("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = req.query.search as string;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    let conditions = [];
    if (search) conditions.push(`(name ILIKE '%${search.replace(/'/g, "''")}%' OR email ILIKE '%${search.replace(/'/g, "''")}%')`);
    if (status === "active") conditions.push("is_active = true");
    else if (status === "inactive") conditions.push("is_active = false");

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const totalRes = await db.execute(`SELECT COUNT(*) as count FROM users ${where}`);
    const total = Number(totalRes.rows[0].count);

    const users = await db.execute(`SELECT id, name, email, role, is_active as "isActive", plan_id as "planId", company, phone, services, created_at as "createdAt" FROM users ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);

    res.json({ users: users.rows, total, page, limit });
  } catch (err) { next(err); }
});

router.get("/:userId", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.userId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid user ID" }); return; }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const { password, ...safe } = user;
    res.json(safe);
  } catch (err) { next(err); }
});

router.patch("/:userId", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.userId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid user ID" }); return; }
    const { name, phone, company, services } = req.body;
    const [updated] = await db.update(usersTable).set({ name, phone, company, services }).where(eq(usersTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "User not found" }); return; }
    const { password, ...safe } = updated;
    res.json(safe);
  } catch (err) { next(err); }
});

router.patch("/:userId/status", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.userId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid user ID" }); return; }
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") { res.status(400).json({ error: "isActive boolean required" }); return; }
    const [updated] = await db.update(usersTable).set({ isActive }).where(eq(usersTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "User not found" }); return; }
    const { password, ...safe } = updated;
    res.json(safe);
  } catch (err) { next(err); }
});

router.patch("/:userId/plan", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.userId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid user ID" }); return; }
    const { planId } = req.body;
    if (!planId || typeof planId !== "number") { res.status(400).json({ error: "planId number required" }); return; }
    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId));
    if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }
    const [updated] = await db.update(usersTable).set({ planId }).where(eq(usersTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "User not found" }); return; }
    const { password, ...safe } = updated;
    res.json(safe);
  } catch (err) { next(err); }
});

export default router;
