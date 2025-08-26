import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, Role } from '../../../lib/auth';
import { addUser, getUser } from '../../../lib/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password, role } = req.body as { username?: string; password?: string; role?: Role };

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  if (getUser(username)) {
    return res.status(409).json({ message: 'User exists' });
  }

  const passwordHash = await hashPassword(password);
  addUser({ username, passwordHash, role });

  return res.status(201).json({ message: 'Registered' });
}
