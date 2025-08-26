import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

const clientCreateSchema = z.object({
  name: z.string().min(1, "Tên khách hàng là bắt buộc"),
});

export async function GET(req: NextRequest) {
  const guard = requireAuth()(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const clients = await prisma.client.findMany({
    include: { adAccounts: true, invoices: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const guard = requireAuth(["ADMIN"])(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const body = await req.json();
    const data = clientCreateSchema.parse(body);
    const created = await prisma.client.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
