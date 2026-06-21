import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { db, usersTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "dev-secret-key-change-me-in-production";

export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

export function createToken(userId: number): string {
  const sig = crypto.createHmac("sha256", SECRET).update(String(userId)).digest("hex");
  return `${userId}:${sig}`;
}

export function verifyToken(token: string): number | null {
  const parts = token.split(":");
  if (parts.length !== 2) return null;
  const userId = parseInt(parts[0], 10);
  if (isNaN(userId)) return null;
  const expected = createToken(userId);
  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) return null;
  return userId;
}

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      role: "user" | "admin";
      isActive: boolean;
      planId: number | null;
      company: string | null;
      phone: string | null;
      services: string | null;
      googleId: string | null;
      googlePictureUrl: string | null;
      createdAt: Date;
      token?: string;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = header.slice(7);
  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  const [user] = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    isActive: usersTable.isActive,
    planId: usersTable.planId,
    company: usersTable.company,
    phone: usersTable.phone,
    services: usersTable.services,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, userId));
  if (!user || !user.isActive) {
    res.status(401).json({ error: "User not found or inactive" });
    return;
  }
  req.user = user as any;
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
