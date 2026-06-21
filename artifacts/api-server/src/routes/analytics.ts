import { Router } from "express";
import { db, userLeadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin } from "../lib/auth";

const router = Router();

router.get("/dashboard", authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const r1 = await db.execute(`SELECT COUNT(*) as c FROM user_leads WHERE user_id = ${userId}`);
    const totalLeads = Number(r1.rows[0].c);

    const r2 = await db.execute(`SELECT COUNT(*) as c FROM user_leads WHERE user_id = ${userId} AND assigned_at >= '${today.toISOString()}'`);
    const newLeadsToday = Number(r2.rows[0].c);

    const r3 = await db.execute(`SELECT COUNT(*) as c FROM user_leads WHERE user_id = ${userId} AND status = 'contacted'`);
    const contactedLeads = Number(r3.rows[0].c);

    const r4 = await db.execute(`SELECT COUNT(*) as c FROM user_leads WHERE user_id = ${userId} AND status = 'closed'`);
    const closedLeads = Number(r4.rows[0].c);

    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

    res.json({ totalLeads, newLeadsToday, contactedLeads, closedLeads, conversionRate });
  } catch (err) { next(err); }
});

router.get("/admin", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const r1 = await db.execute("SELECT COUNT(*) as c FROM users");
    const totalUsers = Number(r1.rows[0].c);
    const r2 = await db.execute("SELECT COUNT(*) as c FROM users WHERE is_active = true");
    const activeUsers = Number(r2.rows[0].c);
    const r3 = await db.execute("SELECT COUNT(*) as c FROM leads");
    const totalLeads = Number(r3.rows[0].c);
    const r4 = await db.execute("SELECT COALESCE(SUM(amount), 0) as c FROM payments WHERE status IN ('success', 'completed')");
    const totalRevenue = Number(r4.rows[0].c);
    const r5 = await db.execute("SELECT COUNT(*) as c FROM users WHERE created_at >= date_trunc('month', NOW())");
    const newUsers = Number(r5.rows[0].c);
    const r6 = await db.execute("SELECT COUNT(*) as c FROM leads WHERE created_at >= date_trunc('month', NOW())");
    const newLeads = Number(r6.rows[0].c);
    const r7 = await db.execute("SELECT COALESCE(SUM(amount), 0) as c FROM payments WHERE status IN ('success', 'completed') AND created_at >= date_trunc('month', NOW())");
    const revenueMonth = Number(r7.rows[0].c);

    res.json({
      totalUsers, activeUsers,
      totalLeads, totalRevenue,
      newUsersThisMonth: newUsers, newLeadsThisMonth: newLeads,
      revenueThisMonth: revenueMonth,
    });
  } catch (err) { next(err); }
});

router.get("/leads-by-country", authenticate, async (req, res, next) => {
  try {
    res.json([]);
  } catch (err) { next(err); }
});

router.get("/leads-by-status", authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const result = await db.execute(
      `SELECT status, COUNT(*) as count FROM user_leads WHERE user_id = ${userId} GROUP BY status`
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get("/recent-leads", authenticate, async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const isAdmin = req.user!.role === "admin";
    const userId = isAdmin ? null : req.user!.id;

    const query = `
      SELECT l.id, l.company_name AS "companyName", l.url, l.lead_description AS "leadDescription",
             l.person_name AS "personName", l.website, l.phone_number AS "phoneNumber",
             l.linkedin_url AS "linkedinUrl", l.created_at AS "createdAt", l.updated_at AS "updatedAt"
      FROM leads l
      ${userId ? `LEFT JOIN user_leads ul ON l.id = ul.lead_id AND ul.user_id = ${userId}` : ""}
      ORDER BY l.created_at DESC LIMIT ${limit}
    `;
    const leads = await db.execute(query);
    res.json(leads.rows);
  } catch (err) { next(err); }
});

router.get("/revenue-by-month", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT to_char(created_at, 'YYYY-MM') as month,
              SUM(amount) as revenue,
              COUNT(*) as payments
       FROM payments WHERE status IN ('success', 'completed')
       GROUP BY month ORDER BY month DESC LIMIT 12`
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

export default router;
