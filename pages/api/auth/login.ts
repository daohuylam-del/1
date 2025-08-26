import type { NextApiRequest, NextApiResponse } from 'next';
import { issueJwt, verifyPassword } from '../../../lib/auth';
import { getUser } from '../../../lib/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const user = getUser(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = issueJwt({ username, role: user.role });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400`);
  return res.status(200).json({ message: 'Logged in' });
}
