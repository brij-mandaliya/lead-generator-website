import { Router } from "express";
import { db, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin } from "../lib/auth";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const plans = await db.select({
      id: plansTable.id, name: plansTable.name, price: plansTable.price,
      currency: plansTable.currency, leadsPerDay: plansTable.leadsPerDay,
      features: plansTable.features, isActive: plansTable.isActive,
      createdAt: plansTable.createdAt,
    }).from(plansTable);
    res.json(plans);
  } catch (err) { next(err); }
});

router.post("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { name, price, currency, leadsPerDay, features } = req.body;
    if (!name || price == null || !leadsPerDay) {
      res.status(400).json({ error: "name, price, leadsPerDay required" });
      return;
    }
    const [plan] = await db.insert(plansTable).values({
      name, price, currency: currency || "INR", leadsPerDay,
      features: features || [], isActive: true,
    }).returning();
    res.status(201).json(plan);
  } catch (err) { next(err); }
});

router.patch("/:planId", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.planId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid plan ID" }); return; }
    const { name, price, currency, leadsPerDay, features, isActive } = req.body;
    const [updated] = await db.update(plansTable).set({ name, price, currency, leadsPerDay, features, isActive }).where(eq(plansTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Plan not found" }); return; }
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete("/:planId", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.planId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid plan ID" }); return; }
    const [deleted] = await db.delete(plansTable).where(eq(plansTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Plan not found" }); return; }
    res.json({ message: "Plan deleted" });
  } catch (err) { next(err); }
});

export default router;
