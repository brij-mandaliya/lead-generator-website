import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  razorpaySubscriptionId: text("razorpay_subscription_id").notNull().unique(),
  planId: integer("plan_id").notNull(), // References plansTable.id
  status: text("status", { enum: ["created", "active", "paused", "completed", "cancelled"] }).notNull().default("created"),
  currentStart: timestamp("current_start"),
  currentEnd: timestamp("current_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true, createdAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
