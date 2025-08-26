// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export type AppRole = "ADMIN" | "USER";

export interface JwtUser {
  id: number;
  email?: string;
  role?: AppRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_env";
const JWT_EXPIRES_IN = "7d";

/* ========= Password helpers ========= */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/* ========= JWT helpers ========= */
export function signAuthToken(payload: JwtUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string): JwtUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  } catch {
    return null;
  }
}

/* ========= Cookie helpers ========= */
export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });
  return res;
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return res;
}

export function getUserFromRequest(req: NextRequest): JwtUser | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

/** Guard để dùng trong route handlers (app router) */
export function requireAuth(roles?: AppRole[]) {
  return (req: NextRequest) => {
    const user = getUserFromRequest(req);
    if (!user) {
      return { authorized: false, status: 401, message: "Unauthorized" as const };
    }
    if (roles && user.role && !roles.includes(user.role)) {
      return { authorized: false, status: 403, message: "Forbidden" as const };
    }
    return { authorized: true as const, user };
  };
}
