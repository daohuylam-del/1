import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getUserId } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const clients = await prisma.client.findMany();
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json();
  const client = await prisma.client.create({ data: { name } });
  return NextResponse.json(client);
}
