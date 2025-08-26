import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, AdAccountStatus } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

const adAccountCreateSchema = z.object({
  platformId: z.string().min(1, "platformId bắt buộc"), // ví dụ act_123
  displayName: z.string().optional(),
  status: z.nativeEnum(AdAccountStatus).optional(),
  clientId: z.number().int().optional(), // có thể gán client ngay khi tạo
});

export async function GET(req: NextRequest) {
  const guard = requireAuth()(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  const rows = await prisma.adAccount.findMany({
    include: { client: true, history: true, fundings: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const guard = requireAuth(["ADMIN"])(req);
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const body = await req.json();
    const data = adAccountCreateSchema.parse(body);
    const created = await prisma.adAccount.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
