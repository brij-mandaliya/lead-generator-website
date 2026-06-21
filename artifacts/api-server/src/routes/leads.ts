import { Router } from "express";
import { db, leadsTable, userLeadsTable, usersTable } from "@workspace/db";
import { appendSheetRow } from "@workspace/google-sheets";
import { eq, and } from "drizzle-orm";
import { authenticate, requireAdmin } from "../lib/auth";

const router = Router();

function leadToRow(lead: any): (string | null)[] {
  return [
    lead.companyName || null,
    lead.url || null,
    lead.leadDescription || null,
    lead.personName || null,
    lead.website || null,
    lead.phoneNumber || null,
    lead.linkedinUrl || null,
  ];
}

async function syncLeadToUserSheets(lead: any): Promise<void> {
  try {
    const activeUsers = await db.select({
      id: usersTable.id,
      googleSheetId: usersTable.googleSheetId,
    }).from(usersTable)
      .where(
        and(
          eq(usersTable.isActive, true),
          // Only users with a plan and a sheet
        )
      );

    const subscribedUsers = activeUsers.filter(u => u.googleSheetId);

    const row = leadToRow(lead);

    for (const user of subscribedUsers) {
      if (!user.googleSheetId) continue;
      try {
        await appendSheetRow(user.googleSheetId, row);
      } catch (sheetErr) {
        console.error(`Failed to sync lead to user ${user.id} sheet:`, sheetErr);
      }
    }
  } catch (err) {
    console.error("Failed to sync leads to user sheets:", err);
  }
}

router.get("/", authenticate, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const isAdmin = req.user!.role === "admin";

    const companyName = req.query.companyName as string;
    const statusFilter = req.query.status as string;

    let conditions: string[] = [];
    if (companyName) conditions.push(`l.company_name ILIKE '%${companyName.replace(/'/g, "''")}%'`);
    if (statusFilter && statusFilter !== "all") conditions.push(`ul.status = '${statusFilter.replace(/'/g, "''")}'`);

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const userId = isAdmin ? null : req.user!.id;

    const totalRes = await db.execute(
      `SELECT COUNT(*) as count FROM leads l LEFT JOIN user_leads ul ON l.id = ul.lead_id AND ul.user_id = ${userId || 0} ${where}`
    );
    const total = Number(totalRes.rows[0].count);

    const query = `
      SELECT l.id, l.company_name AS "companyName", l.url, l.lead_description AS "leadDescription",
             l.person_name AS "personName", l.website, l.phone_number AS "phoneNumber",
             l.linkedin_url AS "linkedinUrl", l.created_at AS "createdAt", l.updated_at AS "updatedAt",
             ul.status AS "userStatus", ul.notes AS "userNotes"
      FROM leads l
      LEFT JOIN user_leads ul ON l.id = ul.lead_id AND ul.user_id = ${userId || 0}
      ${where}
      ORDER BY l.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
    const leads = await db.execute(query);

    res.json({ leads: leads.rows, total, page, limit });
  } catch (err) { next(err); }
});

router.post("/", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { companyName, url, leadDescription, personName, website, phoneNumber, linkedinUrl } = req.body;
    if (!companyName || !leadDescription) {
      res.status(400).json({ error: "companyName and leadDescription required" });
      return;
    }
    const [lead] = await db.insert(leadsTable).values({
      companyName, url, leadDescription, personName, website, phoneNumber, linkedinUrl,
    }).returning();

    // Sync new lead to all active subscribed users' Google Sheets
    syncLeadToUserSheets(lead).catch(err =>
      console.error("Background sheet sync failed:", err)
    );

    res.status(201).json(lead);
  } catch (err) { next(err); }
});

router.get("/:leadId", authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params.leadId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid lead ID" }); return; }
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
    if (!lead) { res.status(404).json({ error: "Lead not found" }); return; }

    let userStatus = null, userNotes = null;
    if (req.user!.role !== "admin") {
      const [ul] = await db.select().from(userLeadsTable).where(
        and(eq(userLeadsTable.userId, req.user!.id), eq(userLeadsTable.leadId, id))
      );
      if (ul) { userStatus = ul.status; userNotes = ul.notes; }
    }
    res.json({ ...lead, userStatus, userNotes });
  } catch (err) { next(err); }
});

router.patch("/:leadId", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.leadId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid lead ID" }); return; }
    const { companyName, url, leadDescription, personName, website, phoneNumber, linkedinUrl } = req.body;
    const [updated] = await db.update(leadsTable).set({
      companyName, url, leadDescription, personName, website, phoneNumber, linkedinUrl,
      updatedAt: new Date(),
    }).where(eq(leadsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Lead not found" }); return; }
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete("/:leadId", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.leadId as string);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid lead ID" }); return; }
    await db.delete(userLeadsTable).where(eq(userLeadsTable.leadId, id));
    const [deleted] = await db.delete(leadsTable).where(eq(leadsTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Lead not found" }); return; }
    res.json({ message: "Lead deleted" });
  } catch (err) { next(err); }
});

router.patch("/:leadId/status", authenticate, async (req, res, next) => {
  try {
    const leadId = parseInt(req.params.leadId as string);
    if (isNaN(leadId)) { res.status(400).json({ error: "Invalid lead ID" }); return; }
    const { status } = req.body;
    if (!["new", "contacted", "closed"].includes(status)) {
      res.status(400).json({ error: "Status must be new, contacted, or closed" });
      return;
    }
    const userId = req.user!.id;
    const [existing] = await db.select().from(userLeadsTable).where(
      and(eq(userLeadsTable.userId, userId), eq(userLeadsTable.leadId, leadId))
    );
    if (existing) {
      const [updated] = await db.update(userLeadsTable).set({ status }).where(
        and(eq(userLeadsTable.userId, userId), eq(userLeadsTable.leadId, leadId))
      ).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(userLeadsTable).values({ userId, leadId, status }).returning();
      res.status(201).json(created);
    }
  } catch (err) { next(err); }
});

router.patch("/:leadId/notes", authenticate, async (req, res, next) => {
  try {
    const leadId = parseInt(req.params.leadId as string);
    if (isNaN(leadId)) { res.status(400).json({ error: "Invalid lead ID" }); return; }
    const { notes } = req.body;
    if (typeof notes !== "string") { res.status(400).json({ error: "notes string required" }); return; }
    const userId = req.user!.id;
    const [existing] = await db.select().from(userLeadsTable).where(
      and(eq(userLeadsTable.userId, userId), eq(userLeadsTable.leadId, leadId))
    );
    if (existing) {
      const [updated] = await db.update(userLeadsTable).set({ notes }).where(
        and(eq(userLeadsTable.userId, userId), eq(userLeadsTable.leadId, leadId))
      ).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(userLeadsTable).values({ userId, leadId, status: "new", notes }).returning();
      res.status(201).json(created);
    }
  } catch (err) { next(err); }
});

export default router;