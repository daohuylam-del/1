import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getUserId(req: NextRequest): number | null {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload === 'string') return parseInt(payload);
    return (payload as any).sub as number;
  } catch {
    return null;
  }
}
