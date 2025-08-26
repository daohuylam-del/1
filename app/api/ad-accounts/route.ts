import { NextResponse } from 'next/server';
import { adAccountSchema } from '../../../lib/validators';
import { adAccounts } from '../../../lib/data';

export async function GET() {
  return NextResponse.json(adAccounts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = adAccountSchema.parse(body);
    const adAccount = { id: crypto.randomUUID(), ...data };
    adAccounts.push(adAccount);
    return NextResponse.json(adAccount, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
