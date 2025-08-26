import { NextResponse } from 'next/server';
import { clientSchema } from '../../../lib/validators';
import { clients } from '../../../lib/data';

export async function GET() {
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = clientSchema.parse(body);
    const client = { id: crypto.randomUUID(), ...data };
    clients.push(client);
    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
