import { NextResponse } from 'next/server';
import { clientSchema } from '../../../../lib/validators';
import { clients } from '../../../../lib/data';

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const client = clients.find(c => c.id === params.id);
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const data = clientSchema.partial().parse(body);
    const index = clients.findIndex(c => c.id === params.id);
    if (index === -1) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    clients[index] = { ...clients[index], ...data };
    return NextResponse.json(clients[index]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const index = clients.findIndex(c => c.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  const [deleted] = clients.splice(index, 1);
  return NextResponse.json(deleted);
}
