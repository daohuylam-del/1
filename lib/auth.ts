import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export type Role = 'ADMIN' | 'ACCOUNTANT' | 'VIEWER';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface JwtPayload {
  username: string;
  role: Role;
}

export function issueJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function requireRole(roles: Role[], handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies['token'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = verifyJwt(token);
    if (!payload || !roles.includes(payload.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    (req as any).user = payload;
    return handler(req, res);
  };
}
