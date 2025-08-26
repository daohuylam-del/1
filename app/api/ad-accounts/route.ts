import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getUserId } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accounts = await prisma.adAccount.findMany();
  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, clientId } = await req.json();
  const account = await prisma.adAccount.create({ data: { name, clientId } });
  return NextResponse.json(account);
}
