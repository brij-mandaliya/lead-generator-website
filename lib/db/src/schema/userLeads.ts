import { pgTable, integer, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userLeadsTable = pgTable(
  "user_leads",
  {
    userId: integer("user_id").notNull(),
    leadId: integer("lead_id").notNull(),
    status: text("status", { enum: ["new", "contacted", "closed"] }).notNull().default("new"),
    notes: text("notes"),
    assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.leadId] })]
);

export const insertUserLeadSchema = createInsertSchema(userLeadsTable);
export type InsertUserLead = z.infer<typeof insertUserLeadSchema>;
export type UserLead = typeof userLeadsTable.$inferSelect;
