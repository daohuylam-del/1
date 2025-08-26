import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

const clientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = requireAuth()(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const id = Number(params.id);
  const item = await prisma.client.findUnique({
    where: { id },
    include: { adAccounts: true, invoices: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = requireAuth(["ADMIN"])(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const id = Number(params.id);
    const body = await req.json();
    const data = clientUpdateSchema.parse(body);
    const updated = await prisma.client.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = requireAuth(["ADMIN"])(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const id = Number(params.id);
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
