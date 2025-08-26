import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, AdAccountStatus } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

const adAccountUpdateSchema = z.object({
  platformId: z.string().min(1).optional(),
  displayName: z.string().optional(),
  status: z.nativeEnum(AdAccountStatus).optional(),
  clientId: z.number().int().nullable().optional(), // cho phép bỏ gán client
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
  const item = await prisma.adAccount.findUnique({
    where: { id },
    include: { client: true, history: true, fundings: true, spends: true, invoices: true },
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
    const data = adAccountUpdateSchema.parse(body);
    const updated = await prisma.adAccount.update({ where: { id }, data });
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
    await prisma.adAccount.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
