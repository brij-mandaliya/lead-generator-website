import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db, usersTable, plansTable, leadsTable, paymentsTable } from "@workspace/db";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-key-change-me-in-production";

function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(password).digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  // ── Plans ──────────────────────────────────────────────────────────
  console.log("Resetting plans and payments for fresh demo data...");
  await db.delete(paymentsTable);
  await db.delete(plansTable);

  console.log("Creating plans...");
  const [starterPlan] = await db.insert(plansTable).values({
    name: "Starter",
    price: 5000,
    currency: "INR",
    leadsPerDay: 10,
    features: [
      "10–12 project opportunities daily",
      "Direct links to job posts (Upwork, LinkedIn, and more)",
      "Contact email details when available",
      "Fresh and actively updated leads every day",
      "Actionable sales and outreach guidance",
    ],
    isActive: true,
  }).returning();

  const [growthPlan] = await db.insert(plansTable).values({
    name: "Growth",
    price: 25000,
    currency: "INR",
    leadsPerDay: 25,
    features: [
      "Personalized leads tailored to your business niche",
      "High-value international prospects and clients",
      "Leads sourced from trusted online platforms",
      "Verified contact information for better outreach",
      "Custom-written 1:1 outreach emails",
      "Weekly 30-minute consultation and strategy call",
    ],
    isActive: true,
  }).returning();

  // Aliases for the rest of the seed (keeps demo-user and payment logic intact)
  let proPlan: typeof plansTable.$inferSelect = growthPlan;
  let agencyPlan: typeof plansTable.$inferSelect | null = null;

  console.log("Created plans: Starter (₹5,000), Growth (₹25,000)");

  // ── Admin user ─────────────────────────────────────────────────────
  const [existingAdmin] = await db.select().from(usersTable).where(eq(usersTable.email, "admin@leadforge.app"));
  let adminUser: typeof usersTable.$inferSelect;

  if (!existingAdmin) {
    [adminUser] = await db.insert(usersTable).values({
      name: "Admin",
      email: "admin@leadforge.app",
      password: hashPassword("admin123"),
      role: "admin",
      isActive: true,
    }).returning();
    console.log("Created admin: admin@leadforge.app / admin123");
  } else {
    adminUser = existingAdmin;
    console.log("Admin already exists");
  }

  // ── Demo user ──────────────────────────────────────────────────────
  const [existingDemo] = await db.select().from(usersTable).where(eq(usersTable.email, "demo@leadforge.app"));
  let demoUser: typeof usersTable.$inferSelect;

  if (!existingDemo) {
    [demoUser] = await db.insert(usersTable).values({
      name: "Alex Johnson",
      email: "demo@leadforge.app",
      password: hashPassword("demo123"),
      role: "user",
      company: "Growth Agency",
      phone: "+1 555 0123",
      planId: proPlan!.id,
      isActive: true,
    }).returning();
    console.log("Created demo user: demo@leadforge.app / demo123");
  } else {
    demoUser = existingDemo;
    // Plans were just wiped, so re-assign the demo user to the new Growth plan
    await db.update(usersTable).set({ planId: proPlan!.id }).where(eq(usersTable.email, "demo@leadforge.app"));
    console.log("Demo user exists — re-assigned to Growth plan");
  }

  // ── Leads ──────────────────────────────────────────────────────────
  const existingLeads = await db.select().from(leadsTable);
  if (existingLeads.length < 10) {
    console.log("Creating leads...");
    const leads = [
      { companyName: "TechFlow Solutions", url: "https://techflow.io", leadDescription: "Seeking SaaS integration partner for a 6-month React/Node engagement. Budget approved, decision maker identified.", personName: "Sarah Chen", website: "https://techflow.io", phoneNumber: "+1 415 555 0101", linkedinUrl: "https://linkedin.com/in/sarahchen" },
      { companyName: "GrowthHQ Agency", url: "https://growthhq.com", leadDescription: "Fast-growing digital agency needs full website overhaul with SEO. Currently evaluating 3 vendors. Team of 15, scaling fast.", personName: "James Wilson", website: "https://growthhq.com", phoneNumber: "+44 20 7946 0123", linkedinUrl: "https://linkedin.com/in/jameswilson" },
      { companyName: "NovaSaaS", url: "https://novasaas.com", leadDescription: "Pre-seed startup with $500K raised. Looking for a development partner to build their iOS/Android MVP. Timeline: 3 months.", personName: "Priya Patel", website: "https://novasaas.com", phoneNumber: "+1 416 555 0198", linkedinUrl: "https://linkedin.com/in/priyapatel" },
      { companyName: "Horizon Analytics", url: null, leadDescription: "Series A data startup needs to automate their ETL pipeline. Python/AWS expertise required. Long-term partnership preferred.", personName: "Mike O'Brien", website: "https://horizonanalytics.io", phoneNumber: "+61 2 9356 7890", linkedinUrl: null },
      { companyName: "PeakRetail", url: "https://peakretail.com", leadDescription: "Established retailer migrating from legacy system to Shopify Plus. Complex integrations with ERP required.", personName: null, website: "https://peakretail.com", phoneNumber: null, linkedinUrl: "https://linkedin.com/company/peakretail" },
      { companyName: "MindBridge AI", url: "https://mindbridge.ai", leadDescription: "AI startup looking for HubSpot/Zapier specialist. Immediate start, fully remote. Small team, big ambitions.", personName: "Anika Sharma", website: "https://mindbridge.ai", phoneNumber: "+91 98765 43210", linkedinUrl: "https://linkedin.com/in/anikasharma" },
      { companyName: "BlueOcean Ventures", url: "https://blueocean.vc", leadDescription: "Investment firm implementing Salesforce CRM with custom workflows. High budget, slow procurement.", personName: "David Kim", website: "https://blueocean.vc", phoneNumber: "+1 212 555 0145", linkedinUrl: "https://linkedin.com/in/davidkim" },
      { companyName: "Artisan Labs", url: null, leadDescription: "Early-stage creative agency spinning out of a larger consultancy. Needs full brand identity package and Figma design system.", personName: "Emma Torres", website: "https://artisanlabs.design", phoneNumber: "+44 20 7123 4567", linkedinUrl: "https://linkedin.com/in/emmatorres" },
      { companyName: "CloudStack", url: "https://cloudstack.io", leadDescription: "Series B SaaS company needs external DevOps audit and Kubernetes migration roadmap. Security compliance required.", personName: "Raj Mehta", website: "https://cloudstack.io", phoneNumber: "+1 650 555 0234", linkedinUrl: null },
      { companyName: "EcoMetrics", url: "https://ecometrics.earth", leadDescription: "ESG reporting startup building a real-time sustainability dashboard. Open to both agency and freelancer.", personName: null, website: "https://ecometrics.earth", phoneNumber: "+49 30 1234 5678", linkedinUrl: "https://linkedin.com/company/ecometrics" },
      { companyName: "HealthSync", url: "https://healthsync.health", leadDescription: "Health tech startup building HIPAA-compliant patient portal. EMR integration required. Funded, moving fast.", personName: "Dr. Lisa Wang", website: "https://healthsync.health", phoneNumber: "+1 617 555 0398", linkedinUrl: "https://linkedin.com/in/lisawang" },
      { companyName: "LogiTrack", url: null, leadDescription: "Logistics company needs real-time fleet tracking dashboard with driver app. Looking for experienced team.", personName: "Tom Harris", website: "https://logitrack.com", phoneNumber: "+61 3 9876 5432", linkedinUrl: "https://linkedin.com/in/tomharris" },
      { companyName: "LegalEase", url: "https://legalease.io", leadDescription: "LegalTech startup building contract generation and e-signature platform. Looking for full-stack partner.", personName: "Sophie Martin", website: "https://legalease.io", phoneNumber: "+44 20 7305 6789", linkedinUrl: "https://linkedin.com/in/sophiemartin" },
      { companyName: "EdifyPro", url: "https://edifypro.com", leadDescription: "Online education provider needs LMS customization and new reporting features. Ongoing contract.", personName: "Carlos Gomez", website: "https://edifypro.com", phoneNumber: "+1 604 555 0122", linkedinUrl: "https://linkedin.com/in/carlosgomez" },
      { companyName: "FintechX", url: "https://fintechx.io", leadDescription: "Fintech startup needs Stripe and local payment gateway integration for their marketplace. PCI compliance required.", personName: "Aisha Patel", website: "https://fintechx.io", phoneNumber: "+1 510 555 0678", linkedinUrl: "https://linkedin.com/in/aishapatel" },
    ];

    for (const lead of leads) {
      await db.insert(leadsTable).values(lead);
    }
    console.log(`Created ${leads.length} leads`);
  } else {
    console.log(`${existingLeads.length} leads already exist, skipping...`);
  }

  // ── Payments ───────────────────────────────────────────────────────
  if (demoUser! && proPlan!) {
    // Payments were already cleared at the top of the seed, so always insert
    const monthsAgoList = [3, 2, 1, 0];
    for (const monthsAgo of monthsAgoList) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsAgo);
      await db.insert(paymentsTable).values({
        userId: demoUser!.id,
        planId: proPlan!.id,
        amount: 25000,
        currency: "INR",
        status: "success",
        razorpayOrderId: `seed_order_${demoUser!.id}_${monthsAgo}`,
        razorpayPaymentId: `seed_payment_${demoUser!.id}_${monthsAgo}`,
        razorpaySignature: `seed_signature_${demoUser!.id}_${monthsAgo}`,
      });
    }
    console.log("Created 4 sample payments for demo user (₹25,000 each)");
  }

  console.log("\n✅ Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin login:  admin@leadforge.app / admin123");
  console.log("Demo login:   demo@leadforge.app  / demo123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
