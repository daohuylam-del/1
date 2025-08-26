import { NextResponse } from 'next/server';
import { adAccountSchema } from '../../../../lib/validators';
import { adAccounts } from '../../../../lib/data';

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const adAccount = adAccounts.find(a => a.id === params.id);
  if (!adAccount) return NextResponse.json({ error: 'Ad account not found' }, { status: 404 });
  return NextResponse.json(adAccount);
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const data = adAccountSchema.partial().parse(body);
    const index = adAccounts.findIndex(a => a.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Ad account not found' }, { status: 404 });
    adAccounts[index] = { ...adAccounts[index], ...data };
    return NextResponse.json(adAccounts[index]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const index = adAccounts.findIndex(a => a.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Ad account not found' }, { status: 404 });
  const [deleted] = adAccounts.splice(index, 1);
  return NextResponse.json(deleted);
}
