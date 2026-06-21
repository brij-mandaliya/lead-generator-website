import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  company: text("company"),
  services: text("services"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  planId: integer("plan_id"),
  googleSheetId: text("google_sheet_id"),
  googleSheetSharedAt: timestamp("google_sheet_shared_at"),
  googleId: text("google_id").unique(), // NEW: Google OAuth ID
  googlePictureUrl: text("google_picture_url"), // NEW: Google profile picture URL
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable, {
  password: (schema) => schema.optional().default(""), // Make password optional
}).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
