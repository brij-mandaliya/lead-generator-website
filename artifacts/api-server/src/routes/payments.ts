import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db, paymentsTable, plansTable, usersTable } from "@workspace/db";
import {
  createGoogleSheet,
  populateSheetHeaders,
  shareGoogleSheetWithUser,
  getSheetUrl,
} from "@workspace/google-sheets";
import { sendSheetAccessEmail } from "../lib/email";
import { eq } from "drizzle-orm";
import { authenticate, requireAdmin } from "../lib/auth";

const router = Router();

function getRazorpayInstance(): Razorpay {
  const env = process.env.RAZORPAY_ENVIRONMENT || "test";
  const keyId = env === "live"
    ? process.env.RAZORPAY_KEY_ID_LIVE
    : process.env.RAZORPAY_KEY_ID_TEST;
  const keySecret = env === "live"
    ? process.env.RAZORPAY_KEY_SECRET_LIVE
    : process.env.RAZORPAY_KEY_SECRET_TEST;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function getRazorpayKeyId(): string {
  const env = process.env.RAZORPAY_ENVIRONMENT || "test";
  return env === "live"
    ? process.env.RAZORPAY_KEY_ID_LIVE || ""
    : process.env.RAZORPAY_KEY_ID_TEST || "";
}

function getWebhookSecret(): string {
  const env = process.env.RAZORPAY_ENVIRONMENT || "test";
  return env === "live"
    ? process.env.RAZORPAY_WEBHOOK_SECRET_LIVE || ""
    : process.env.RAZORPAY_WEBHOOK_SECRET_TEST || "";
}

const LEAD_COLUMNS = [
  "company_name",
  "url",
  "lead_description",
  "person_name",
  "website",
  "phone_number",
  "linkedin_url",
];

async function processPaymentSuccess(
  userId: number,
  planId: number,
  paymentId: string,
  orderId: string,
  signature: string,
  amount: number,
  currency: string
): Promise<void> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) throw new Error("User not found");

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId));
  if (!plan) throw new Error("Plan not found");

  const sheetTitle = `Leads - ${user.name || user.email} - ${plan.name}`;
  let spreadsheetId: string | null = null;

  try {
    spreadsheetId = await createGoogleSheet(sheetTitle);
    await populateSheetHeaders(spreadsheetId, LEAD_COLUMNS);

    if (user.email) {
      await shareGoogleSheetWithUser(spreadsheetId, user.email, user.name || "");
    }

    const sheetUrl = getSheetUrl(spreadsheetId);
    await sendSheetAccessEmail(user.email, user.name || "User", sheetUrl, plan.name);
  } catch (sheetErr) {
    console.error("Google Sheets processing failed:", sheetErr);
  }

  await db.insert(paymentsTable).values({
    userId,
    planId,
    amount,
    currency,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: signature,
    status: "success",
    description: `Payment for ${plan.name} plan`,
  }).execute();

  await db.update(usersTable).set({
    planId,
    googleSheetId: spreadsheetId,
    googleSheetSharedAt: spreadsheetId ? new Date() : null,
  }).where(eq(usersTable.id, userId)).execute();
}

// GET /api/payments — list payments (admin sees all, user sees own)
router.get("/", authenticate, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const isAdmin = req.user!.role === "admin";
    const userId = isAdmin ? (parseInt(req.query.userId as string) || null) : req.user!.id;

    const where = userId ? `WHERE p.user_id = ${userId}` : "";
    const totalRes = await db.execute(`SELECT COUNT(*) as count FROM payments p ${where}`);
    const total = Number(totalRes.rows[0].count);

    const payments = await db.execute(
      `SELECT p.id, p.user_id AS "userId", p.amount, p.currency, p.status,
              p.plan_id AS "planId", p.created_at AS "createdAt"
       FROM payments p ${where}
       ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );
    res.json({ payments: payments.rows, total, page, limit });
  } catch (err) { next(err); }
});

// GET /api/payments/key — return Razorpay key ID
router.get("/key", authenticate, (_req, res) => {
  const keyId = getRazorpayKeyId();
  if (!keyId) {
    res.status(500).json({ error: "Razorpay key not configured" });
    return;
  }
  res.json({ key: keyId });
});

// POST /api/payments/create-order — create a real Razorpay order
router.post("/create-order", authenticate, async (req, res, next) => {
  try {
    const { planId } = req.body;
    if (!planId) { res.status(400).json({ error: "planId required" }); return; }

    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId));
    if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

    const razorpay = getRazorpayInstance();
    const amount = Math.round(plan.price * 100);

    const order = await razorpay.orders.create({
      amount,
      currency: plan.currency,
      receipt: `plan_${planId}_user_${req.user!.id}_${Date.now()}`,
      notes: {
        userId: String(req.user!.id),
        planId: String(planId),
      },
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: plan.id,
      planName: plan.name,
    });
  } catch (err) { next(err); }
});

// POST /api/payments/create-upi-order — UPI order (creates real Razorpay order)
router.post("/create-upi-order", authenticate, async (req, res, next) => {
  try {
    const { planId } = req.body;
    if (!planId) { res.status(400).json({ error: "planId required" }); return; }

    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId));
    if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

    const razorpay = getRazorpayInstance();
    const amount = Math.round(plan.price * 100);

    const order = await razorpay.orders.create({
      amount,
      currency: plan.currency,
      receipt: `upi_plan_${planId}_user_${req.user!.id}_${Date.now()}`,
      notes: {
        userId: String(req.user!.id),
        planId: String(planId),
      },
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: plan.id,
      planName: plan.name,
    });
  } catch (err) { next(err); }
});

// POST /api/payments/verify — verify payment and process subscription
router.post("/verify", authenticate, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const keySecret = process.env.RAZORPAY_ENVIRONMENT === "live"
      ? process.env.RAZORPAY_KEY_SECRET_LIVE
      : process.env.RAZORPAY_KEY_SECRET_TEST;

    if (!keySecret) {
      res.status(500).json({ error: "Razorpay secret not configured" });
      return;
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }

    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId));
    if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

    const amount = Math.round(plan.price * 100);

    await processPaymentSuccess(
      req.user!.id,
      planId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      plan.currency
    );

    res.json({ success: true, message: "Payment verified and plan activated" });
  } catch (err) { next(err); }
});

// POST /api/payments/webhook — Razorpay webhook handler
router.post("/webhook", async (req, res) => {
  try {
    const webhookSecret = getWebhookSecret();
    if (!webhookSecret) {
      console.warn("Webhook secret not configured, skipping webhook validation");
      res.status(200).json({ status: "ignored" });
      return;
    }

    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      res.status(400).json({ error: "Missing signature" });
      return;
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      res.status(400).json({ error: "Invalid webhook signature" });
      return;
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured" && payload?.payment?.entity) {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const notes = payment.notes || {};

      const userId = parseInt(notes.userId);
      const planId = parseInt(notes.planId);
      const amount = payment.amount;
      const currency = payment.currency;

      if (!userId || !planId) {
        console.warn("Webhook: missing userId/planId in payment notes");
        res.status(200).json({ status: "ignored", reason: "missing notes" });
        return;
      }

      const [existing] = await db.select().from(paymentsTable)
        .where(eq(paymentsTable.razorpayPaymentId, paymentId))
        .limit(1);

      if (existing) {
        res.status(200).json({ status: "already_processed" });
        return;
      }

      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
      if (!user) {
        console.warn(`Webhook: user ${userId} not found`);
        res.status(200).json({ status: "ignored", reason: "user not found" });
        return;
      }

      await processPaymentSuccess(
        userId,
        planId,
        paymentId,
        orderId,
        `webhook_${signature.slice(0, 16)}`,
        amount,
        currency
      );

      res.status(200).json({ status: "processed" });
    } else {
      res.status(200).json({ status: "ignored", event });
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;