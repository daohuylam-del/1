import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getUserId } from '../../../../lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await prisma.adAccount.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(account);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, clientId } = await req.json();
  const account = await prisma.adAccount.update({ where: { id: Number(params.id) }, data: { name, clientId } });
  return NextResponse.json(account);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.adAccount.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
